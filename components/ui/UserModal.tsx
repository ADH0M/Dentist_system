"use client";
import Link from "next/link";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

type IProps = {
  children: React.ReactNode;
  id?: string;
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
      <Link href={"/"}>{props.children}</Link>

      {isOpen && (
        <div className="bg-background/60 backdrop-blur-sm border border-border absolute w-screen h-screen top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center"
        ref={currentRef}
        >

          <div className="bg-background border border-border p-4 rounded-md">
            <div>username</div>
            <section>
              <div>email</div>
            </section>
            <button className="block">log-out</button>
          </div>
          <div className="absolute text-sm font-bold  top-6 right-6 p-3 bg-accent rounded-full w-10 border border-border  h-10 flex items-center justify-center cursor-pointer text-secondary hover:text-primary ">
            x
          </div>
        </div>
      )}
    </main>
  );
});

UserModal.displayName = "User-modal";

export default UserModal;
