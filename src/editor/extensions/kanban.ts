import { Node, mergeAttributes, nodeInputRule } from "@tiptap/core";

export const Kanban = Node.create({
  name: "kanban-node",
  group: "block",
  content: "column+",

  parseHTML() {
    return [{ tag: 'div[data-type="kanban"]' }];
  },

  renderHTML({ node }) {
    const columns = [];

    // Create an array to hold the column elements
    node.content.forEach((columnNode: any, columnIndex: number) => {
      // Create tasks within the column
      const tasks = [];

      columnNode.content.forEach((taskNode: any) => {
        tasks.push(["div", { "data-type": "task" }, taskNode.textContent]);
      });

      // Add the "Add Task" button
      tasks.push([
        "button",
        { class: "add-task-btn", "data-column-index": columnIndex },
        "Add Task",
      ]);

      // Return the column containing the tasks and the button
      columns.push([
        "div",
        { "data-type": "column", "data-index": columnIndex },
        ...tasks,
      ]);
    });

    // Add the "Add Column" button to the bottom of the Kanban board
    columns.push(["button", { class: "add-column-btn" }, "Add Column"]);

    // Return the full Kanban board structure
    return ["div", { "data-type": "kanban" }, ...columns];
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /!kanban\s$/,
        type: this.type, // refers to the current node type (Kanban)
        getAttributes: () => ({}), // No additional attributes needed for the Kanban node
      }),
    ];
  },
});

export const Column = Node.create({
  name: "column",
  group: "block",
  content: "task*",

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-type": "column" }, HTMLAttributes),
      0,
    ];
  },

  // @ts-ignore
  addCommands() {
    return {
      // @ts-ignore
      addColumn: ({ commands }) => {
        commands.insertContent({
          type: "column",
          content: [
            {
              type: "task",
              text: "New Task",
            },
          ],
        });
      },
    };
  },
});

export const Task = Node.create({
  name: "task",
  group: "block",
  content: "text*",

  parseHTML() {
    return [{ tag: 'div[data-type="task"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-type": "task" }, HTMLAttributes), 0];
  },

  // @ts-ignore
  addCommands() {
    return {
      addTask: (columnIndex: number, taskText: string = "New Task") => {
        const { state, commands } = this.editor;
        let columnPos = 0;
        let columnFound = false;

        // Traverse the document to find the column position
        state.doc.forEach((node, offset) => {
          if (node.type.name === "kanban") {
            node.forEach((childNode, childOffset) => {
              if (childNode.type.name === "column" && columnIndex === 0) {
                columnPos = offset + childOffset + 1;
                columnFound = true;
              }
              columnIndex -= 1;
            });
          }
        });

        if (!columnFound) {
          console.error("Column not found at the given index.");
          return false;
        }

        commands.insertContentAt(columnPos, {
          type: "task",
          content: [
            {
              type: "text",
              text: taskText,
            },
          ],
        });
      },
    };
  },
});
