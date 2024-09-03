import React, { useState } from 'react';

// Simple versions of the components
const DialogLayout: React.FC<{ open: boolean; onOpenChange: () => void; children: React.ReactNode }> = ({ open, onOpenChange, children }) => (
  <div style={{ display: open ? 'block' : 'none' }}>{children}</div>
);

const OAuthSocialButton: React.FC<{ className: string; logo: string; onClick: (event: React.MouseEvent<HTMLButtonElement>) => void; children: React.ReactNode }> = ({ className, logo, onClick, children }) => (
  <button className={className} onClick={onClick}>
    <img src={logo} alt="logo" style={{ marginRight: '8px' }} />
    {children}
  </button>
);

interface TextFieldProps {
  className: string;
  variant: string;
  label: string;
  helpText: string;
  children: React.ReactNode;
}

interface TextFieldInputProps {
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const TextField: React.FC<TextFieldProps> & { Input: React.FC<TextFieldInputProps> } = ({ className, variant, label, helpText, children }) => (
  <div className={className}>
    <label>{label}</label>
    {children}
    {helpText && <small>{helpText}</small>}
  </div>
);

TextField.Input = ({ placeholder, value, onChange, type = 'text' }: TextFieldInputProps) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
);

const Button: React.FC<{ className: string; size: string; icon: any; onClick: (event: React.MouseEvent<HTMLButtonElement>) => void; children: React.ReactNode }> = ({ className, size, icon, onClick, children }) => (
  <button className={className} onClick={onClick}>
    {icon && <span>{icon}</span>}
    {children}
  </button>
);

const SimpleSignInCardCopy: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <DialogLayout open={true} onOpenChange={() => {}}>
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-50">
        <div className="flex w-full max-w-[384px] flex-col items-center justify-center gap-8 rounded border border-solid border-neutral-border bg-white pt-12 pr-12 pb-12 pl-12">
          <img className="w-40 flex-none" src="https://res.cloudinary.com/subframe/image/upload/v1711417518/shared/fdb8rlpzh1gds6vzsnt0.svg" alt="Logo" />
          <div className="flex w-full flex-col items-start gap-6">
            <div className="flex w-full flex-col items-start gap-4">
              <OAuthSocialButton className="h-10 w-full flex-none" logo="https://res.cloudinary.com/subframe/image/upload/v1711417516/shared/z0i3zyjjqkobzuaecgno.svg" onClick={() => {}}>
                Sign in with Google
              </OAuthSocialButton>
              <OAuthSocialButton className="h-10 w-full flex-none" logo="https://res.cloudinary.com/subframe/image/upload/v1711417561/shared/kplo8lv2zjit3brqmadv.png" onClick={() => {}}>
                Sign in with Apple
              </OAuthSocialButton>
            </div>
            <div className="flex w-full items-center justify-center gap-2">
              <div className="flex h-px grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
              <span className="text-caption font-caption text-subtext-color">or</span>
              <div className="flex h-px grow shrink-0 basis-0 flex-col items-center gap-2 bg-neutral-border" />
            </div>
            <div className="flex w-full flex-col items-start gap-6">
              <TextField className="h-auto w-full flex-none" variant="outline" label="Email" helpText="">
                <TextField.Input placeholder="Your email address..." value={email} onChange={(e) => setEmail(e.target.value)} />
              </TextField>
              <TextField className="h-auto w-full flex-none" variant="outline" label="Password" helpText="">
                <TextField.Input type="password" placeholder="Your password..." value={password} onChange={(e) => setPassword(e.target.value)} />
              </TextField>
            </div>
          </div>
          <Button className="h-10 w-full flex-none" size="large" icon={null} onClick={() => {}}>
            Sign in
          </Button>
        </div>
      </div>
    </DialogLayout>
  );
};

export default SimpleSignInCardCopy;