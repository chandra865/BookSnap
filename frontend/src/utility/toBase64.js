export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // remove data:image/jpeg;base64,
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
