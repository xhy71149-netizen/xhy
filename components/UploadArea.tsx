import React, { useRef } from 'react';

interface UploadAreaProps {
  label: string;
  subLabel?: string;
  accept: string;
  icon: string;
  multiple?: boolean;
  onFileSelect: (files: FileList) => void;
  disabled?: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  label,
  subLabel,
  accept,
  icon,
  multiple = false,
  onFileSelect,
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
        ${disabled 
          ? 'border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed' 
          : 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50 bg-slate-800/30'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center gap-3">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center transition-colors
          ${disabled ? 'bg-slate-700 text-slate-500' : 'bg-slate-700/50 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300'}
        `}>
          <span className="material-icons-round text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-slate-200 font-medium">{label}</h3>
          {subLabel && <p className="text-slate-500 text-sm mt-1">{subLabel}</p>}
        </div>
      </div>
    </div>
  );
};
