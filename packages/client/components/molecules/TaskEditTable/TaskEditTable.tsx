/* import { MenuOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    key: "sort",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

function Row({ children, ...props }: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === "sort") {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: "none", cursor: "move" }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
}

export default function TaskEditTable(): JSX.Element {
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address:
        "Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sidney No. 1 Lake Park",
    },
  ]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        // rowKey array
        items={dataSource.map((i) => i.key)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          components={{
            body: {
              row: Row,
            },
          }}
          rowKey="key"
          columns={columns}
          dataSource={dataSource}
        />
      </SortableContext>
    </DndContext>
  );
} */

import { MenuOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import type { Task } from "@webbnissarna/bingo-chill-common/src/game/types";
import { TagsInput, TextButton, TextInputField } from "@/components/atoms";

interface DataType extends Task {
  key: string;
}

const columns: ColumnsType<DataType> = [
  {
    key: "sort",
  },
  {
    title: "Icon",
    dataIndex: "icon",
    render: () => <div className="w-12 h-12 bg-polarNight-0 rounded-md" />,
  },
  {
    title: "Name",
    dataIndex: "name",
    render: (v) => <TextInputField value={v} onChange={() => undefined} />,
  },
  {
    title: "Tags",
    dataIndex: "tags",
    render: (v) => (
      <TagsInput
        values={v}
        onChange={() => undefined}
        options={["A", "B", "C", "D"].map((x) => ({
          label: x,
          value: x.toLowerCase(),
        }))}
        placeholder="tags"
      />
    ),
  },
  {
    render: () => <TextButton text="Delete" onClick={() => undefined} />,
  },
];

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

function Row({ children, ...props }: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === "sort") {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: "none", cursor: "move" }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
}

export default function TaskEditTable(): JSX.Element {
  const [count, setCount] = useState(2);
  const [dataSource, setDataSource] = useState<DataType[]>([
    { key: "1", name: "Hello World", icon: "", tags: ["A", "B", "C"] },
    { key: "2", name: "Hello World 2", icon: "", tags: ["A", "B", "C"] },
  ]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  const add = () => {
    setDataSource([
      ...dataSource,
      { key: `${count}`, name: "", icon: "", tags: [] },
    ]);
    setCount(count + 1);
  };

  return (
    <div className="flex flex-col gap-2">
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSource.map((i) => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            pagination={false}
            components={{
              body: {
                row: Row,
              },
            }}
            rowKey="key"
            columns={columns}
            dataSource={dataSource}
          />
        </SortableContext>
      </DndContext>
      <TextButton text="+" onClick={add} />
    </div>
  );
}
