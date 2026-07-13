interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchBar({
    value,
    onChange
}: SearchBarProps) {

    return (
        <div style={{ width: "100%" }}>
            <input
                type="text"
                placeholder="Search files or components..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "15px",
                    fontFamily: "var(--sans)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text-h)",
                    boxSizing: "border-box",
                    outline: "none",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)"
                }}
            />
        </div>
    );
}