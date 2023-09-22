import {
  DeleteOutlined,
  MenuOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
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
import React, { useEffect, useId, useMemo, useState } from "react";
import type { Task } from "@webbnissarna/bingo-chill-common/src/game/types";
import { TagsInput, Button, TextInputField } from "@/components/atoms";
import ImagePicker from "@/components/molecules/ImagePicker";
import { nanoid } from "nanoid";
import type { Tag } from "@/components/atoms/TagsInput";
import { patch } from "@webbnissarna/bingo-chill-common/src/utils/functional";

export interface TaskWithKey extends Task {
  key: string;
}

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
    ...(isDragging ? { position: "relative", zIndex: 1337 } : {}),
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

function TaskToDateType(task: Task | TaskWithKey): TaskWithKey {
  return { ...task, key: (task as TaskWithKey).key ?? nanoid() };
}

export interface TaskEditTableProps {
  tasks: Task[];
  onChanged: (newTasks: TaskWithKey[]) => void;
}

export function stripKey(task: TaskWithKey | Task): Task {
  return { ...task, key: undefined } as unknown as Task;
}

export default function TaskEditTable({
  tasks,
  onChanged,
}: TaskEditTableProps): JSX.Element {
  const [dataSource, setDataSource] = useState<TaskWithKey[]>([]);

  useEffect(() => {
    setDataSource(tasks.map(TaskToDateType));
  }, [tasks, setDataSource]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = dataSource.findIndex((i) => i.key === active.id);
      const overIndex = dataSource.findIndex((i) => i.key === over?.id);
      const changed = arrayMove(dataSource, activeIndex, overIndex);
      setDataSource(changed);
      onChanged(changed);
    }
  };

  const add = () => {
    onChanged([...dataSource, { key: nanoid(), name: "", icon: "", tags: [] }]);
  };

  const del = (key: string) => {
    onChanged(dataSource.filter((v) => v.key !== key));
  };

  const edit = (key: string, update: Partial<TaskWithKey>) => {
    onChanged(
      dataSource.map((item) => (item.key === key ? patch(item, update) : item)),
    );
  };

  const allTags = useMemo<Tag[]>(
    () =>
      [...new Set(tasks.map((t) => t.tags).flat())]
        .map((value) => ({
          value,
          label: value,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [tasks],
  );

  const columns: ColumnsType<TaskWithKey> = [
    {
      width: 50,
      key: "sort",
      align: "center",
    },
    {
      title: "Icon",
      dataIndex: "icon",
      width: 100,
      render: (_, { key, icon }) => (
        <ImagePicker
          value={icon}
          onChange={(newIcon) => edit(key, { icon: newIcon ?? undefined })}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_, { key, name }) => (
        <TextInputField
          value={name}
          onChange={(newName) => edit(key, { name: newName })}
        />
      ),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      render: (_, { key, tags }) => (
        <TagsInput
          values={tags}
          onChange={(newTags) => edit(key, { tags: newTags })}
          options={allTags}
          placeholder="tags"
        />
      ),
    },
    {
      width: 70,
      render: (_, { key }) => (
        <Button variant="dangerous" onClick={() => del(key)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  const dndId = useId();

  return (
    <div className="flex flex-col gap-2">
      <DndContext
        id={dndId}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
      >
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
      <Button onClick={add}>
        <PlusCircleOutlined />
      </Button>
    </div>
  );
}
