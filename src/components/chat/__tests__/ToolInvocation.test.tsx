import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolInvocation } from "../ToolInvocation";

describe("ToolInvocation", () => {
  describe("str_replace_editor tool", () => {
    it("should display 'Creating file' for create command", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        args: { command: "create", path: "Button.jsx" },
        state: "pending" as const,
      };

      render(<ToolInvocation toolName="str_replace_editor" state="pending" toolInvocation={toolInvocation} />);
      expect(screen.getByText("Creating file: Button.jsx")).toBeInTheDocument();
    });

    it("should display 'Editing file' for str_replace command", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        args: { command: "str_replace", path: "App.jsx" },
        state: "pending" as const,
      };

      render(<ToolInvocation toolName="str_replace_editor" state="pending" toolInvocation={toolInvocation} />);
      expect(screen.getByText("Editing file: App.jsx")).toBeInTheDocument();
    });

    it("should display 'Inserting into file' for insert command", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        args: { command: "insert", path: "index.js" },
        state: "pending" as const,
      };

      render(<ToolInvocation toolName="str_replace_editor" state="pending" toolInvocation={toolInvocation} />);
      expect(screen.getByText("Inserting into file: index.js")).toBeInTheDocument();
    });

    it("should display 'Viewing file' for view command", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        args: { command: "view", path: "Config.js" },
        state: "pending" as const,
      };

      render(<ToolInvocation toolName="str_replace_editor" state="pending" toolInvocation={toolInvocation} />);
      expect(screen.getByText("Viewing file: Config.js")).toBeInTheDocument();
    });

    it("should show loading spinner when pending", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        args: { command: "create", path: "Button.jsx" },
        state: "pending" as const,
      };

      render(<ToolInvocation toolName="str_replace_editor" state="pending" toolInvocation={toolInvocation} />);
      const loader = screen.getByRole("img", { hidden: true });
      expect(loader).toHaveClass("animate-spin");
    });

    it("should show success indicator when completed", () => {
      const toolInvocation = {
        toolName: "str_replace_editor",
        args: { command: "create", path: "Button.jsx" },
        state: "result" as const,
        result: { success: true },
      };

      render(<ToolInvocation toolName="str_replace_editor" state="result" toolInvocation={toolInvocation} />);
      const successDot = document.querySelector(".bg-emerald-500");
      expect(successDot).toBeInTheDocument();
    });
  });

  describe("file_manager tool", () => {
    it("should display 'Renaming' for rename command", () => {
      const toolInvocation = {
        toolName: "file_manager",
        args: { command: "rename", path: "OldName.jsx", new_path: "NewName.jsx" },
        state: "pending" as const,
      };

      render(<ToolInvocation toolName="file_manager" state="pending" toolInvocation={toolInvocation} />);
      expect(screen.getByText("Renaming: OldName.jsx → NewName.jsx")).toBeInTheDocument();
    });

    it("should display 'Deleting' for delete command", () => {
      const toolInvocation = {
        toolName: "file_manager",
        args: { command: "delete", path: "Unused.jsx" },
        state: "pending" as const,
      };

      render(<ToolInvocation toolName="file_manager" state="pending" toolInvocation={toolInvocation} />);
      expect(screen.getByText("Deleting: Unused.jsx")).toBeInTheDocument();
    });
  });

  it("should fallback to tool name for unknown tools", () => {
    const toolInvocation = {
      toolName: "custom_tool",
      state: "pending" as const,
    };

    render(<ToolInvocation toolName="custom_tool" state="pending" toolInvocation={toolInvocation} />);
    expect(screen.getByText("custom_tool")).toBeInTheDocument();
  });
});
