import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect,
  // 1. IMPORT THÊM 2 TYPE NÀY
  Dispatch,
  SetStateAction
} from "react";

// (Interface User của bạn đã đúng, giữ nguyên)
interface User {
    id: number; 
    role: "admin" | "designer" | "user";
    name: string;
    email: string;
    img: string;
}

// 2. SỬA LẠI AuthContextType
interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    setUser: Dispatch<SetStateAction<User | null>>; // <-- THÊM DÒNG NÀY
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // (Các hàm useEffect của bạn đã đúng, giữ nguyên)
    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            try {
                setUser(JSON.parse(saved));
            } catch {
                localStorage.removeItem("user");
            }
        }
    }, []);

    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    const login = (userData: User) => setUser(userData);
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    // 3. SỬA LẠI VALUE (thêm 'setUser')
    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// (Custom hook giữ nguyên)
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};