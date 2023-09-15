import {
  Heading,
  Subtitle,
  Text,
  TextButton,
  TextInputField,
} from "@/components/atoms";
import TagsInput from "@/components/atoms/TagsInput/TagsInput";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Table } from "antd";
import { useState } from "react";

export interface EditorTemplateProps {}

interface ColumnData {
  key: string;
  icon: string;
  name: string;
  tags: string;
}

interface RowProps {
  id: string;
}

function Row({ id }: RowProps) {
  const {} = useSortable({ id });

  return (
    <tr className="flex gap-2 items-center bg-polarNight-1 rounded-md p-1">
      <div className="w-12 h-12 bg-polarNight-0 rounded-md"></div>
      <div className="grow">
        <TextInputField value="" onChange={() => undefined} />
      </div>
      <div className="grow">
        <TagsInput
          placeholder="tags"
          values={[]}
          options={[]}
          onChange={() => undefined}
        />
      </div>
      <TextButton onClick={() => undefined} text="x" />
    </tr>
  );
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

export default function EditorTemplate({}: EditorTemplateProps): JSX.Element {
  const [dataSource, setDataSource] = useState<{ key: string }[]>([]);

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
    <div className="bg-polarNight-0 w-screen h-full min-h-screen max-w-full max-h-full flex flex-row gap-4 justify-center md:p-2 md:py-14">
      <div className="bg-polarNight-1 w-full max-w-3xl p-2 flex flex-col items-center gap-2 md:rounded-2xl">
        <div className="flex flex-col items-center justify-center">
          <Heading>Bingo Chillin'</Heading>
          <Subtitle>Game Setup Editor</Subtitle>
        </div>

        <div className="flex gap-2">
          <TextButton text="Load" onClick={() => undefined} />
          <TextButton text="Save" onClick={() => undefined} />
          <TextButton text="Copy" onClick={() => undefined} />
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-2 w-full items-center">
          <div className="flex items-center">
            <div className="grow basis-36">
              <Text>Timestamp</Text>
            </div>
            <div className="opacity-50">
              <Text>2023-06-01</Text>
            </div>
          </div>

          <div className="flex items-center">
            <div className="grow basis-36">
              <Text>Game Name</Text>
            </div>
            <TextInputField value="" onChange={() => undefined} />
          </div>

          <div className="flex items-center">
            <div className="grow basis-36">
              <Text>Version</Text>
            </div>
            <TextInputField value="" onChange={() => undefined} />
          </div>

          <div className="flex items-center">
            <div className="grow basis-36">
              <Text>Author</Text>
            </div>
            <TextInputField value="" onChange={() => undefined} />
          </div>
        </div>

        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            // rowKey array
            items={dataSource.map(({ key }) => key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  row: Row,
                },
              }}
              rowKey="key"
              columns={[
                { key: "sort" },
                { title: "Icon", dataIndex: "icon" },
                { title: "Name", dataIndex: "name" },
                { title: "Tags", dataIndex: "tags" },
              ]}
              dataSource={dataSource}
            />
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
