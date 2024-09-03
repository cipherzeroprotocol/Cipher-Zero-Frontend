import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Listbox, Transition } from '@headlessui/react';// here is giving error 
import axios from 'axios';
import cx from 'classnames';
// import styles from './video.css';
import { ethers } from 'ethers';
import 'video.js/dist/video-js.css';

//import styles from './Video.module.css';
 import styles from './Video.module.css';

//import styles from './Video.module.css'; // can not import css file from file frontend/theta-integration/video-api/Video.module.css

const Video = () => {
    const resolutions = [2160, 1080, 720, 360];
    const workers = ['External Elite Edge Node']; // Only external worker is available
    const networks = [
        { name: 'Theta Mainnet', value: 361 },
        { name: 'Theta Testnet', value: 365 },
        { name: 'Ethereum Mainnet', value: 1 },
        { name: 'ETH Goerli Testnet', value: 5 },
    ];

    const [videoURL, setVideoURL] = useState<string>('');
    const [videoName, setVideoName] = useState<string>('');
    const [videoDescription, setVideoDescription] = useState<string>('');
    const [selectedResolutions, setSelectedResolutions] = useState<number[]>([]);
    const [selectedWorker, setSelectedWorker] = useState<string>('External Elite Edge Node');
    const [collections, setCollections] = useState<{ address: string, network: string }[]>([{ address: '', network: 'Theta Mainnet' }]);
    const [apiKeys, setApiKeys] = useState<{ key: string, secret: string }>({ key: '', secret: '' });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [transcodingId, setTranscodingId] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement>(null); // For the Drag and drop element

    // Initialize default resolutions
    React.useEffect(() => {
        setSelectedResolutions(resolutions);
    }, []);

    // Handle drag over event
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    // Handle drop event
    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files && files[0].type.startsWith('video')) {
            setVideoFile(files[0]);
        }
    };

    // Handle file change event
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0].type.startsWith('video')) {
            setVideoFile(files[0]);
        }
    };

    // Toggle resolution selection
    const toggleResolution = (resolution: number) => {
        setSelectedResolutions(prev => 
            prev.includes(resolution) 
                ? prev.filter(res => res !== resolution) 
                : [...prev, resolution]
        );
    };

    // Remove resolution from selection
    const removeResolution = (resolution: number) => {
        setSelectedResolutions(prev => prev.filter(res => res !== resolution));
    };

    // Add a new collection for DRM
    const handleAddCollection = () => {
        setCollections(prev => [...prev, { address: '', network: 'Theta Mainnet' }]);
    };

    // Remove a collection from the list
    const handleRemoveCollection = (index: number) => {
        setCollections(prev => prev.filter((_, i) => i !== index));
    };

    // Handle address change in a collection
    const handleAddressChange = (index: number, address: string) => {
        const newCollections = [...collections];
        newCollections[index].address = address;
        setCollections(newCollections);
    };

    // Handle network change in a collection
    const handleNetworkChange = (index: number, network: string) => {
        const newCollections = [...collections];
        newCollections[index].network = network;
        setCollections(newCollections);
    };

    // Save video function
    const handleSaveVideo = () => {
        setErrorMessage('');
        if (selectedResolutions.length === 0) {
            setErrorMessage('Select Resolution for video Transcoding');
            return;
        }
        if (videoURL === '' && videoFile == null) {
            setErrorMessage('No video URL or video upload provided!');
        } else {
            transcodeVideo(null).catch(() => {
                setErrorMessage('Invalid video URL. Please fix and then try again.');
            });
        }
    };

    // Get signed URL for video upload
    const getSignedURL = async () => {
        try {
            const response = await axios.post('https://api.thetavideoapi.com/upload', {}, {
                headers: {
                    'x-tva-sa-id': apiKeys.key,
                    'x-tva-sa-secret': apiKeys.secret,
                },
            });
            return response.data.body.uploads[0];
        } catch (error) {
            console.error('Error fetching signed URL:', error);
            setErrorMessage('Failed to get signed URL.');
        }
    };

    // Upload video file
    const uploadVideo = async () => {
        if (videoFile) {
            try {
                setIsUploading(true);
                const uploads = await getSignedURL();
                const signedURL = uploads.presigned_url;

                if (!signedURL) {
                    console.error('Failed to get signed URL.');
                    setErrorMessage('Failed to get signed URL.');
                    return;
                }

                await axios.put(signedURL, videoFile, {
                    headers: {
                        'Content-Type': 'application/octet-stream',
                    },
                });
                transcodeVideo(uploads.id);
            } catch (error) {
                setIsUploading(false);
                console.error('Error uploading the file:', error);
            }
        }
    };

    // Create transcoding data
    const createTranscodeData = (id: string | null): any => {
        const baseData = {
            playback_policy: 'public',
            resolutions: selectedResolutions,
        };

        if (id) {
            return { ...baseData, source_upload_id: id };
        } else {
            return { ...baseData, source_uri: videoURL };
        }
    };

    // Get DRM rules
    const getDrmRules = (): any[] => {
        return collections.reduce((rules: any[], collection) => {
            if (ethers.isAddress(collection.address) && collection.network) {
                const network = networks.find(net => net.name === collection.network);
                const chainId = network?.value;

                if (!rules.some(rule => rule.chain_id === chainId && rule.nft_collection === collection.address)) {
                    rules.push({
                        chain_id: chainId,
                        nft_collection: collection.address,
                    });
                }
            }
            return rules;
        }, []);
    };

    // Get video metadata
    const getMetadata = () => {
        const metadata: any = {};
        if (videoName) metadata.name = videoName;
        if (videoDescription) metadata.description = videoDescription;
        return Object.keys(metadata).length ? metadata : null;
    };

    // Transcode video
    const transcodeVideo = async (id: string | null) => {
        const data = createTranscodeData(id);
        const drmRules = getDrmRules();
        data.use_drm = drmRules.length > 0;
        if (data.use_drm) data.drm_rules = drmRules;
        const metadata = getMetadata();
        if (metadata) data.metadata = metadata;

        try {
            const response = await axios.post('https://api.thetavideoapi.com/video', JSON.stringify(data), {
                headers: {
                    'x-tva-sa-id': apiKeys.key,
                    'x-tva-sa-secret': apiKeys.secret,
                    'Content-Type': 'application/json',
                },
            });
            setTranscodingId(response.data.body.videos[0].id);
            setIsUploading(false);
        } catch (error) {
            setTranscodingId('');
            setErrorMessage(videoURL ? 'Invalid video URL. Please fix and then try again.' : 'Error starting Video transcoding');
            console.error('Error fetching transcoding Video:', error);
        }
    };

    // Handle back to new video setup
    const handleBackToNewVideo = (newValue: string) => {
        setTranscodingId(newValue);
        setVideoFile(null);
        setVideoURL('');
        setVideoDescription('');
        setVideoName('');
        setCollections([{ address: '', network: 'Theta Mainnet' }]);
        setSelectedResolutions(resolutions);
        setSelectedWorker('External Elite Edge Node');
    };

    if (!apiKeys.key || !apiKeys.secret) {
        return <ApiKeys setApiKeys={setApiKeys} />;
    }

    if (transcodingId) {
        return <Transcoding apiKey={apiKeys.key} apiSecret={apiKeys.secret} id={transcodingId} name={videoName} handleBackToNewVideo={handleBackToNewVideo} />;
    }

    return (
        <div className={styles.alignment}>
            <h1 className={styles.title}>New Video</h1>
            <input 
                className={styles.videoURL}
                type="url"
                placeholder="Enter video URL"
                value={videoURL}
                onChange={(e) => setVideoURL(e.target.value)}
            />
            <input
                className={styles.videoName}
                type="text"
                placeholder="Enter video name"
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
            />
            <textarea
                className={styles.videoDescription}
                placeholder="Enter video description"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
            />
            <div className={styles.dropZone} onDrop={handleDrop} onDragOver={handleDragOver}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <p>Drag & Drop video file here</p>
                <button onClick={() => fileInputRef.current?.click()}>Upload Video File</button>
            </div>
            <div className={styles.resolutionSelector}>
                <h2>Resolution</h2>
                {resolutions.map(res => (
                    <div key={res} className={styles.resolutionOption}>
                        <input
                            type="checkbox"
                            checked={selectedResolutions.includes(res)}
                            onChange={() => toggleResolution(res)}
                        />
                        <span>{res}p</span>
                        <button onClick={() => removeResolution(res)}>Remove</button>
                    </div>
                ))}
            </div>
            <div className={styles.workerSelector}>
                <h2>Worker</h2>
                <Listbox value={selectedWorker} onChange={setSelectedWorker}>
                    <div className="relative mt-2">
                        <Listbox.Button className={styles.dropdownButton}>{selectedWorker}</Listbox.Button>
                        <Transition
                            as="div"
                            className="absolute mt-2 bg-white shadow-lg rounded-lg w-full"
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Listbox.Options className="py-1">
                                {workers.map(worker => (
                                    <Listbox.Option key={worker} value={worker}>
                                        {({ active, selected }) => (
                                            <div className={cx(styles.dropdownOption, { [styles.selected]: selected, [styles.active]: active })}>
                                                {worker}
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>
            <div className={styles.drmCollections}>
                <h2>DRM Collections</h2>
                {collections.map((collection, index) => (
                    <div key={index} className={styles.collectionItem}>
                        <input
                            type="text"
                            placeholder="NFT Collection Address"
                            value={collection.address}
                            onChange={(e) => handleAddressChange(index, e.target.value)}
                        />
                        <select
                            value={collection.network}
                            onChange={(e) => handleNetworkChange(index, e.target.value)}
                        >
                            {networks.map(net => (
                                <option key={net.value} value={net.name}>
                                    {net.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={() => handleRemoveCollection(index)}>Remove</button>
                    </div>
                ))}
                <button onClick={handleAddCollection}>Add Collection</button>
            </div>
            <button className={styles.saveButton} onClick={handleSaveVideo} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Save Video'}
            </button>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>
    );
};

// Placeholder for ApiKeys component
const ApiKeys = ({ setApiKeys }: { setApiKeys: (keys: { key: string, secret: string }) => void }) => {
    const [key, setKey] = useState('');
    const [secret, setSecret] = useState('');

    const handleSubmit = () => {
        setApiKeys({ key, secret });
    };

    return (
        <div className={styles.apiKeys}>
            <h1>Enter API Keys</h1>
            <input
                type="text"
                placeholder="API Key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
            />
            <input
                type="text"
                placeholder="API Secret"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

// Placeholder for Transcoding component
const Transcoding = ({ apiKey, apiSecret, id, name, handleBackToNewVideo }: { apiKey: string, apiSecret: string, id: string, name: string, handleBackToNewVideo: (newValue: string) => void }) => {
    const [status, setStatus] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);

    React.useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get(`https://api.thetavideoapi.com/video/${id}`, {
                    headers: {
                        'x-tva-sa-id': apiKey,
                        'x-tva-sa-secret': apiSecret,
                    },
                });
                setStatus(response.data.body.status);
                setProgress(response.data.body.progress);
            } catch (error) {
                console.error('Error fetching transcoding status:', error);
            }
        };

        const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [id, apiKey, apiSecret]);

    return (
        <div className={styles.transcoding}>
            <h1>Transcoding {name}</h1>
            <p>Status: {status}</p>
            <p>Progress: {progress}%</p>
            <button onClick={() => handleBackToNewVideo('')}>Back to New Video</button>
        </div>
    );
};

export default Video;
