type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  size?: "full" | "xl" | "lg" | "md" | "sm";
};

const sizes = {
  full: "w-full px-4 sm:px-6 lg:px-8 xl:px-12",
  xl: "max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12",
  lg: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12",
  md: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8",
  sm: "max-w-3xl mx-auto px-4 sm:px-6",
};

export default function Container({ 
  children, 
  className = "", 
  size = "full" 
}: ContainerProps) {
  return (
    <div className={`${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}
