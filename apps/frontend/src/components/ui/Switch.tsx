interface SwitchProps {
  checked: boolean;
  onChange: () => void;
}

export function Switch({ checked, onChange }: Readonly<SwitchProps>) {
  return (
    <div
      onClick={onChange}
      className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ${
        checked ? 'bg-accent' : 'bg-[#2D3339]'
      }`}
    >
      <div
        className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-[#EDEEEC] transition-[left] duration-200 ${
          checked ? 'left-[23px]' : 'left-[3px]'
        }`}
      />
    </div>
  );
}
