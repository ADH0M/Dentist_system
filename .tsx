"use client";
import { logoutAction } from "@/lib/actions/auth-action";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
} | null;

type IProps = {
  children: React.ReactNode;
  id?: string;
  user?: User;
};

export type IControler = {
  open: () => void;
};

const UserModal = forwardRef<IControler, IProps>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentRef = useRef<HTMLDivElement>(null);

  const open = () => {
    setIsOpen(prev=>!prev);
  };


  useImperativeHandle(ref, () => ({
    open,
  }));
  
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };
  
  useEffect(() => {
    const controller =new AbortController();
    if(currentRef.current){
       const handleIsOpen = (e: MouseEvent) => {
         if(isOpen && currentRef.current?.contains(e.target as Node))
           setIsOpen(false);
       };
       document.addEventListener("mousedown", handleIsOpen ,{signal:controller.signal});
    }
    document.addEventListener("keydown", handleEscapeKey ,{signal:controller.signal});

    return () => {
      controller.abort();
    };
  }, [isOpen]);

  return (
    <main className=" block" >
      <div onClick={open} className="cursor-pointer">{props.children}</div>

      {isOpen && (
        <div className="bg-background/60 backdrop-blur-sm border border-border absolute w-screen h-screen top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center z-50"
        ref={currentRef}
        >

          <div className="bg-card border border-border p-6 rounded-xl shadow-lg min-w-[300px] flex flex-col gap-4 relative">
             <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
             >
                ✕
             </button>
            
            <div className="flex flex-col items-center gap-2 mb-2">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-2xl font-bold text-accent-foreground">
                    {props.user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="text-center">
                    <h3 className="font-bold text-lg">{props.user?.username}</h3>
                    <p className="text-sm text-muted-foreground">{props.user?.email}</p>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2">
                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${props.user?.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {props.user?.isActive ? 'Active' : 'Inactive'}
                 </span>
                 <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {props.user?.role}
                 </span>
            </div>

            <div className="border-t border-border pt-4 mt-2">
                <form action={logoutAction}>
                    <button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 py-2 rounded-md transition-colors font-medium">
                        Log Out
                    </button>
                </form>
            </div>
            
          </div>
        </div>
      )}
    </main>
  );
});

UserModal.displayName = "User-modal";

export default UserModal;
