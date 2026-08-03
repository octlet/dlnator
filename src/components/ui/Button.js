export default function Button({
  variant = "outline",
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-white text-black",
    outline: "border border-white/8 text-white/80",
  };

  return (
    <button
      className={`rounded-xl text-sm ${variants[variant] || variants.outline} ${className}`}
      {...props}
    />
  );
}
