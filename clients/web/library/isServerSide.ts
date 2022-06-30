// Check if context is server side or client side
const isServerSide = (): boolean => {
  return typeof window === "undefined";
};

export default isServerSide;
