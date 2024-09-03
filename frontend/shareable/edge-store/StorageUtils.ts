// Utility function to convert a Blob to a file URL
export const blobToFileUrl = (blob: Blob): string => {
    return URL.createObjectURL(blob);
  };
  
  // Utility function to download a Blob as a file
  export const downloadBlobAsFile = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  };
  
  // Utility function to read a file as a data URL (base64 encoded)
  export const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  