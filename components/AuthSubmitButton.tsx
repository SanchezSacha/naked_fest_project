type AuthSubmitButtonProps = {
  children: React.ReactNode;
};

export default function AuthSubmitButton({ children }: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      className="group relative mt-12 w-full border-2 border-lime bg-lime px-6 py-7 font-display text-[clamp(38px,9vw,64px)] uppercase leading-none text-dark transition-all duration-300 hover:bg-[#111113] hover:[color:var(--neon-lime)] hover:shadow-[0_0_28px_rgba(200,255,0,0.22)] focus:outline-none focus-visible:ring-4 focus-visible:ring-lime/45"
    >
      <span className="absolute -left-3 bottom-0 h-6 w-6 bg-lime transition-colors duration-300 group-hover:bg-[#111113]" />
      <span className="absolute -right-3 top-0 h-6 w-6 bg-lime transition-colors duration-300 group-hover:bg-[#111113]" />
      <span className="relative">{children}</span>
    </button>
  );
}
