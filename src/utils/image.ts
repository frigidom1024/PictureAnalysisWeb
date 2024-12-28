export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); //读取文件内容
    reader.onload = () => resolve(reader.result as string);//读取成功时返回URL
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.readAsDataURL(file);//读取文件内容
  });
};