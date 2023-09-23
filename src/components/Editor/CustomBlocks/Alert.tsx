import {
  BlockNoteEditor,
  BlockSpec,
  DefaultBlockSchema,
  defaultProps,
  PropSchema,
  SpecificBlock,
} from "@blocknote/core";
import {
  createReactBlockSpec,
  InlineContent,
  ReactSlashMenuItem,
} from "@blocknote/react";
import { AlertCircle, Ban, Check, Info, ShieldAlertIcon } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const alertTypes = {
  warning: {
    icon: ShieldAlertIcon,
    color: "#e69819",
    backgroundColor: {
      light: "#fff6e6",
      dark: "#805d20",
    },
  },
  error: {
    icon: Ban,
    color: "#d80d0d",
    backgroundColor: {
      light: "#ffe6e6",
      dark: "#802020",
    },
  },
  info: {
    icon: Info,
    color: "#507aff",
    backgroundColor: {
      light: "#e6ebff",
      dark: "#203380",
    },
  },
  success: {
    icon: Check,
    color: "#0bc10b",
    backgroundColor: {
      light: "#e6ffe6",
      dark: "#208020",
    },
  },
} as const;

export const alertPropSchema = {
  textAlignment: defaultProps.textAlignment,
  textColor: defaultProps.textColor,
  type: {
    default: "warning" as const,
    values: ["warning", "error", "info", "success"] as const,
  },
} satisfies PropSchema;

// Component for the Alert block
export const Alert = (props: {
  block: SpecificBlock<
    DefaultBlockSchema & { alert: BlockSpec<"alert", typeof alertPropSchema> },
    "alert"
  >;
  editor: BlockNoteEditor<
    DefaultBlockSchema & { alert: BlockSpec<"alert", typeof alertPropSchema> }
  >;
  theme: "light" | "dark";
}) => {
  const [type, setType] = useState(props.block.props.type);
  console.log(type, "type");
  const Icon = alertTypes[type].icon;

  return (
    <div
      className="space-x-2"
      style={{
        ...alertStyles,
        backgroundColor: alertTypes[type].backgroundColor[props.theme],
      }}
    >
      <Select>
        <SelectTrigger className="w-fit">
          <SelectValue>
            <div
              style={{
                ...alertIconWrapperStyles,
                backgroundColor: alertTypes[type].color,
              }}
              contentEditable={false}
            >
              <Icon
                style={{ color: alertTypes[type].backgroundColor[props.theme] }}
                size={24}
              />
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(alertTypes).map(([key, value]) => {
              const ItemIcon = value.icon;

              return (
                <SelectItem key={key} value={key}>
                  <div
                    className="flex w-fit items-center gap-2 text-xs"
                    onClick={() => {
                      console.log("updatig type to ", key);
                      setType(key as keyof typeof alertTypes);
                    }}
                  >
                    <ItemIcon size={12} color={value.color} />
                    {key.slice(0, 1).toUpperCase() + key.slice(1)}
                  </div>
                </SelectItem>
              );
            })}
            {/* {/* <SelectLabel>Fruits</SelectLabel> */}
          </SelectGroup>
        </SelectContent>
      </Select>

      <InlineContent style={inlineContentStyles} />
    </div>
  );
};

// Function which creates the Alert block itself, where the component is styled
// correctly with the light & dark theme
export const createAlertBlock = (theme: "light" | "dark") =>
  createReactBlockSpec<
    "alert",
    typeof alertPropSchema,
    true,
    DefaultBlockSchema & { alert: BlockSpec<"alert", typeof alertPropSchema> }
  >({
    type: "alert" as const,
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "warning",
        values: ["warning", "error", "info", "success"],
      },
    } as const,
    containsInlineContent: true,
    render: (props) => <Alert {...props} theme={theme} />,
  });

// Slash menu item to insert an Alert block
export const insertAlert = {
  name: "Alert",
  execute: (editor) => {
    const block = editor.getTextCursorPosition().block;
    const blockIsEmpty = block.content.length === 0;

    // Updates current block to an Alert if it's empty, otherwise inserts a new
    // one below
    if (blockIsEmpty) {
      editor.updateBlock(block, { type: "alert" });
    } else {
      editor.insertBlocks(
        [
          {
            type: "alert",
          },
        ],
        editor.getTextCursorPosition().block,
        "after",
      );
      editor.setTextCursorPosition(editor.getTextCursorPosition().nextBlock!);
    }
  },
  aliases: [
    "alert",
    "notification",
    "emphasize",
    "warning",
    "error",
    "info",
    "success",
  ],
  group: "Other",
  icon: <AlertCircle />,
  hint: "Used to emphasize text",
} satisfies ReactSlashMenuItem<
  DefaultBlockSchema & { alert: BlockSpec<"alert", typeof alertPropSchema> }
>;

const alertStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexGrow: 1,
  borderRadius: "4px",
  // height: "48px",
  padding: "4px",
} as const;

const alertIconWrapperStyles = {
  borderRadius: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginLeft: "12px",
  marginRight: "12px",
  height: "18px",
  width: "18px",
  userSelect: "none",
  cursor: "pointer",
} as const;

const inlineContentStyles = {
  flexGrow: "1",
};