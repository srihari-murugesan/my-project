"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocationProps {
  toolName: string;
  state: "pending" | "result";
  toolInvocation: {
    toolName: string;
    args?: Record<string, any>;
    state: "pending" | "result";
    result?: any;
  };
}

function getToolMessage(toolName: string, args?: Record<string, any>) {
  if (toolName === "str_replace_editor") {
    const command = args?.command;
    const path = args?.path;

    switch (command) {
      case "create":
        return `Creating file: ${path}`;
      case "str_replace":
        return `Editing file: ${path}`;
      case "insert":
        return `Inserting into file: ${path}`;
      case "view":
        return `Viewing file: ${path}`;
      default:
        return `Editing file: ${path}`;
    }
  }

  if (toolName === "file_manager") {
    const command = args?.command;
    const path = args?.path;

    switch (command) {
      case "rename":
        return `Renaming: ${path} → ${args?.new_path}`;
      case "delete":
        return `Deleting: ${path}`;
      default:
        return `Managing file: ${path}`;
    }
  }

  return toolName;
}

export function ToolInvocation({ toolInvocation }: ToolInvocationProps) {
  const isComplete = toolInvocation.state === "result" && toolInvocation.result;
  const message = getToolMessage(toolInvocation.toolName, toolInvocation.args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-medium border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}
