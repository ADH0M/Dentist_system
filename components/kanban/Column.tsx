"use client";

import { DragEvent, useState } from "react";

interface ITask {
  title: string;
  id: string;
  content: string | null;
  favorite: boolean | null;
  order: number;
  userId: string;
  columnId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ColumnData {
  title: string;
  id: string;
  order: number;
  userId: string;
  tasks: ITask[];
}

const Column = ({ column }: { column: ColumnData }) => {
  const [isActive, setIsActive] = useState(false);
  const [state ,setState]=useState<ColumnData>(column);
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    setIsActive(true);
    const indictors = getIndictors(columnId);
    clearIndicators(indictors);
    const element = getNearestNIndicator(e, indictors);
    element.style.opacity = "1";
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    setIsActive(false);
    const indicators = getIndictors(columnId);
    clearIndicators(indicators);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>, columnId: string) => {
    setIsActive(false);
    const indicators = getIndictors(columnId);
    clearIndicators(indicators);
    const taskId = e.dataTransfer.getData("before"); //task id
    const { before, order } = getNearestNIndicator(e, indicators).dataset;
    // console.log( `column-id:${columnId}`, `task-id:${taskId}` ,`index:${before} + order:${order}` );
    if(before === taskId)return ;
    const newIndex = indicators.findIndex((ele)=>ele.dataset.before === before) ;//find new index;
    if(newIndex === -1 ) return;
    const task = state.tasks.find((ele)=>ele.id ===taskId);
    console.log(task);
    

    if(newIndex === 0 ){

    }else if(newIndex < 0 ){

    }else{

    }

  };

  const getIndictors = (columnId: string): HTMLDivElement[] => {
    return Array.from(document.querySelectorAll(`[data-column='${columnId}']`));
  };

  const getNearestNIndicator = (
    e: DragEvent<HTMLDivElement>,
    indicators: HTMLDivElement[]
  ): HTMLDivElement => {
    const OFFSET_DINTANCE = 50;
    let element = {
      offset: Number.NEGATIVE_INFINITY,
      ele: indicators[indicators.length - 1],
    };

    for (const indictor of indicators) {
      const { top } = indictor.getBoundingClientRect();
      const offset = e.clientY - (top + OFFSET_DINTANCE);
      if (offset < 0 && offset > element.offset) {
        element = {
          offset,
          ele: indictor,
        };
      }
    }
    return element.ele;
  };

  const clearIndicators = (indicators: HTMLDivElement[]) => {
    indicators.forEach((indicator) => (indicator.style.opacity = "0"));
  };

  return (
    <div
      className={`${
        isActive ? "bg-white" : "bg-black/50"
      } rounded-lg shadow-sm border border-gray-200 mx-2 w-64 flex flex-col transition-colors`}
      onDragOver={(e) => handleDragOver(e, column.id)}
      onDragLeave={(e) => handleDragLeave(e, column.id)}
      onDrop={(e) => handleDragEnd(e, column.id)}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 truncate">
            {column.title}
          </h2>
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            {column.tasks.length}
          </span>
        </div>
      </div>

      {/* Task List */}
      <Rows
        tasks={column.tasks}
        setIsActive={setIsActive}
        columnId={column.id}
      />
    </div>
  );
};

const Rows = ({
  tasks,
  setIsActive,
  columnId,
}: {
  tasks: ITask[];
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  columnId: string;
}) => {
  const handleDragStart = (e: DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData("before", taskId);
    e.dataTransfer.setData("columnId", columnId);

    setIsActive(true);
  };

  return (
    <div className="flex flex-col gap-2 p-2 overflow-y-auto max-h-[500px]">
      {tasks.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">No tasks</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id}>
            <Task task={task} handleDragStart={handleDragStart} />
          </div>
        ))
      )}
      <HighlightIndictors columnId={columnId} order={"-1"} taskId="-1" />
    </div>
  );
};

const Task = ({
  task,
  handleDragStart,
}: {
  task: ITask;
  handleDragStart: (e: DragEvent<HTMLDivElement>, taskId: string) => void;
}) => {
  return (
    <>
      <HighlightIndictors
        taskId={task.id}
        columnId={task.columnId!}
        order={task.order!}
      />
      <div
        className="bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 p-3 shadow-sm 
      transition-all cursor-pointer"
        onDragStart={(e) => handleDragStart(e, task.id)}
        draggable
      >
        <div className="flex items-start gap-2">
          {/* Favorite Indicator */}
          {task.favorite && <span className="text-yellow-500 mt-0.5">★</span>}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 truncate">{task.title}</h3>
            {task.content && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {task.content}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const HighlightIndictors = ({
  taskId,
  columnId,
  order,
}: {
  taskId: string;
  columnId: string;
  order: string | number;
}) => {
  return (
    <div
      className="h-1 w-full bg-accent rounded-2xl mb-1 opacity-0"
      data-before={taskId}
      data-column={columnId}
      data-order={order}
    />
  );
};
export default Column;
