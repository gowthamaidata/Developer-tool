import { useEffect, useId, useRef, useState, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { copyText, downloadText } from '../lib/files';

export function CopyButton({ text, label = 'Copy', className = 'btn' }: { text: string; label?: string; className?: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle');
  const t = useRef<number>();
  useEffect(() => () => clearTimeout(t.current), []);
  const onClick = async () => {
    const ok = await copyText(text);
    setState(ok ? 'ok' : 'fail');
    clearTimeout(t.current);
    t.current = window.setTimeout(() => setState('idle'), 1600);
  };
  return (
    <button type="button" className={className} onClick={onClick} disabled={!text}>
      <span aria-live="polite">{state === 'ok' ? 'Copied' : state === 'fail' ? 'Copy failed' : label}</span>
    </button>
  );
}

export function DownloadButton({ text, filename, type }: { text: string; filename: string; type?: string }) {
  return (
    <button type="button" className="btn" disabled={!text} onClick={() => downloadText(text, filename, type)}>
      Download
    </button>
  );
}

export function ClearButton({ onClear, disabled }: { onClear: () => void; disabled?: boolean }) {
  return <button type="button" className="btn btn-quiet" onClick={onClear} disabled={disabled}>Clear</button>;
}

interface EditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: ReactNode;
  invalid?: boolean;
  errorId?: string;
}
export function Editor({ label, hint, invalid, errorId, className, ...rest }: EditorProps) {
  const id = useId();
  return (
    <div className="field">
      <div className="field-head">
        <label htmlFor={id}>{label}</label>
        {hint && <span className="field-hint">{hint}</span>}
      </div>
      <textarea
        id={id}
        className={'editor ' + (className || '')}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        {...rest}
      />
    </div>
  );
}

export function Alert({ kind, title, children, id }: { kind: 'error' | 'success' | 'info'; title: string; children?: ReactNode; id?: string }) {
  const icon = kind === 'error' ? '✕' : kind === 'success' ? '✓' : 'i';
  return (
    <div id={id} className={`alert alert-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <span className="alert-icon" aria-hidden="true">{icon}</span>
      <div>
        <strong>{title}</strong>
        {children && <div className="alert-body">{children}</div>}
      </div>
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="toolbar">{children}</div>;
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}
