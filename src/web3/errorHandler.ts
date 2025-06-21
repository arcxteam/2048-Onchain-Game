export const handleError = (error: any) => {
  console.error("Blockchain Error:", error.message);
  return { error: true, message: error.message };
};