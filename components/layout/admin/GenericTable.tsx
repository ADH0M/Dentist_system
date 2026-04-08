//data =>rows , columns =>cols ;

import { ReactNode } from "react";

// type TableProps<T> = {
//   title?: string;
//   data: T[];
//   columns: Columns<T>[];
// };

export type Columns<T, K extends keyof T = keyof T> = {
  key: K;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: T[K], row: T) => any;
};


export interface Col<T> {
  key:  keyof T;
  label: string;
};

type PropsType <T> ={
    columns:Col<T>[];
    data:T[];
}

const GenericTable = <T,>({columns,data }:PropsType<T>) => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold">{'title'}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;
