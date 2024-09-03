// frontend/src/components/FileShare.tsx

import React, { useState } from 'react';
import { Button, Input, Form, Upload, message } from 'antd';
import { UploadOutlined, FileSearchOutlined } from '@ant-design/icons';
import { encryptAndSaveFile, decryptAndSaveFile } from './FileShareService';

// Define the interface for component props
interface FileShareProps {}

// Define the component
const FileShare: React.FC<FileShareProps> = () => {
    const [fileList, setFileList] = useState<any[]>([]);
    const [keyIvFile, setKeyIvFile] = useState<File | null>(null);
    const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
    const [isDecrypting, setIsDecrypting] = useState<boolean>(false);

    // Handler for file selection
    const handleFileChange = (info: any) => {
        if (info.fileList) {
            setFileList(info.fileList);
        }
    };

    // Handler for file encryption
    const handleEncrypt = async () => {
        if (fileList.length === 0) {
            message.error('Please upload a file first.');
            return;
        }
        setIsEncrypting(true);
        try {
            const file = fileList[0].originFileObj;
            await encryptAndSaveFile(file.path, 'encryptedFile.enc');
            message.success('File encrypted and saved successfully.');
        } catch (error) {
            message.error('Error encrypting file: ' + (error as Error).message);
        } finally {
            setIsEncrypting(false);
        }
    };

    // Handler for file decryption
    const handleDecrypt = async () => {
        if (!keyIvFile) {
            message.error('Please upload the key/IV file first.');
            return;
        }
        if (fileList.length === 0) {
            message.error('Please upload the encrypted file first.');
            return;
        }
        setIsDecrypting(true);
        try {
            const encryptedFile = fileList[0].originFileObj;
            const keyIvFilePath = URL.createObjectURL(keyIvFile);
            await decryptAndSaveFile(encryptedFile.path, keyIvFilePath, 'decryptedFile.txt');
            message.success('File decrypted and saved successfully.');
        } catch (error) {
            message.error('Error decrypting file: ' + (error as Error).message);
        } finally {
            setIsDecrypting(false);
        }
    };

    return (
        <div>
            <h2>File Share</h2>
            <Form layout="vertical">
                <Form.Item label="Upload File">
                    <Upload
                        beforeUpload={() => false}
                        fileList={fileList}
                        onChange={handleFileChange}
                        showUploadList={{ showPreviewIcon: true }}
                    >
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        onClick={handleEncrypt}
                        loading={isEncrypting}
                    >
                        Encrypt File
                    </Button>
                </Form.Item>
                <Form.Item label="Upload Key/IV File">
                    <Upload
                        beforeUpload={() => false}
                        showUploadList={false}
                        onChange={(info: { file: React.SetStateAction<File | null>; }) => setKeyIvFile(info.file)}
                    >
                        <Button icon={<FileSearchOutlined />}>Select Key/IV File</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        onClick={handleDecrypt}
                        loading={isDecrypting}
                    >
                        Decrypt File
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default FileShare;
