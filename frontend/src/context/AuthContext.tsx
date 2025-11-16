// authcontext.tsx (Revised)
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    // Dispatch,
    // SetStateAction
} from "react";
import { supabase } from '../lib/supabaseClient';
import { Session, User as SupabaseUser } from '@supabase/supabase-js'; // Import Supabase types
// Define the shape of your custom user data
interface UserProfile {
    id: string;
    role: string;
    name: string;
    email: string;
    img: string;
}

interface AuthContextType {
    // We use the full Supabase Session object
    session: Session | null;
    // We might also want a loading state
    loading: boolean;
    // We can expose the Supabase User object directly
    user: SupabaseUser | null;
    // You'll need functions to sign in/out via Supabase client
    profile: UserProfile | null;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// ⭐️ HÀM MỚI: Gọi RPC của bạn để lấy profile
const fetchUserProfile = async () => {
    // Gọi tên hàm RPC (Postgres function) mà bạn đã tạo
    const { data, error } = await supabase.rpc('get_my_profile');

    if (error) {
        console.error("Lỗi khi gọi get_my_profile:", error.message);
        return null;
    }

    // RPC có thể trả về một mảng, chúng ta lấy phần tử đầu tiên
    const profileData = Array.isArray(data) ? data[0] : data;

    if (!profileData) {
        console.warn("Không tìm thấy dữ liệu profile cho người dùng này.");
        return null;
    }

    // Đảm bảo dữ liệu trả về khớp với Interface
    return profileData as UserProfile;
};
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State to hold the Supabase Session
    const [session, setSession] = useState<Session | null>(null);
    // State for initial loading (checking local storage)
    const [loading, setLoading] = useState(true);
    // Optional: State for custom user profile data
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null); // Thêm state này để bắt lỗi

    // --- Core Supabase Session Management ---
    useEffect(() => {
        const handleAuthChange = async (currentSession: Session | null) => {
            setSession(currentSession);

            if (currentSession) {
                // NẾU CÓ SESSION: Tự động gọi hàm RPC để lấy profile
                const userProfile = await fetchUserProfile();
                setProfile(userProfile);
            } else {
                // NẾU LOGOUT: Xóa profile
                setProfile(null);
            }

            setLoading(false); // Dù thế nào cũng kết thúc loading
        };
        // 1. Initial Check: Try to load session from Supabase's localStorage
        supabase.auth.getSession().then(({ data: { session } }) => {
            // setSession(session);
            // setLoading(false); // Done loading initial state
            // If you have a session, you might want to load the custom profile here
            // if (session) loadUserProfile(session.user.id);
            handleAuthChange(session);
        }).catch((err) => {
            console.error("Supabase getSession error:", err);
            setError("Lỗi kết nối hoặc xác thực ban đầu.");
            setLoading(false); // Đảm bảo loading = false dù có lỗi
        });

        // 2. Listener: Listen for changes (SIGN_IN, SIGN_OUT, TOKEN_REFRESH)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                // setSession(session);
                // // Reset custom profile on sign out
                // if (!session) setProfile(null);
                // setLoading(false);
                handleAuthChange(session);
            }
        );

        // Cleanup the listener when the component unmounts
        return () => subscription.unsubscribe();
    }, []);
    // --- Tải User Profile (Effect mới) ---
    // useEffect(() => {
    //     // Nếu không có session (đã đăng xuất), đặt profile là null
    //     if (!session) {
    //         setProfile(null);
    //         return;
    //     }

    //     // Tải profile khi có session
    //     const loadUserProfile = async () => {
    //         if (session.user) {
    //             const { data, error } = await supabase
    //                 .from('profiles') // <-- Tên bảng profiles của bạn
    //                 .select('id, role, name, email, img') // <-- Các cột bạn cần
    //                 .eq('id', session.user.id)
    //                 .single();

    //             if (error) {
    //                 console.error('Error loading user profile:', error.message);
    //             } else if (data) {
    //                 setProfile(data as UserProfile);
    //             }
    //         }
    //     };

    //     loadUserProfile();

    // }, [session]); // <-- Chạy lại effect này mỗi khi 'session' thay đổi
    // Function to handle sign out (uses Supabase client)
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error.message);
        }
        setProfile(null); // Xóa profile khi sign out
    };

    // The Supabase user is extracted from the session
    const user = session?.user || null;

    return (
        <AuthContext.Provider value={{
            session,
            loading,
            user,
            signOut,
            profile
        }}>
            {loading && (
                // Nếu đang tải, hiển thị một thông báo
                <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải trạng thái người dùng...</div>
            )}
            {error && (
                // Nếu có lỗi, hiển thị lỗi
                <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Lỗi: {error}</div>
            )}
            {!loading && children}
            {/* You may show a loader here if loading is true */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};