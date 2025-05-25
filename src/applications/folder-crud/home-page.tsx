import { AppSidebar } from "./app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RichTextEditorDemo } from "../text-editor/components/rich-text-editor";
import { FilesProvider, useFilesContext } from "./FilesContext";
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FolderOpen } from "lucide-react";

function PageContent() {
  const { selectedFile, setFileContent, saveFile, folderHandle, pickFolder } = useFilesContext();

  const renderBreadcrumbs = () => {
    if (!selectedFile) {
      return (
        <BreadcrumbItem>
          <BreadcrumbPage>No file selected</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

    // Start with the root folder name
    const rootName = folderHandle?.name || 'Root';
    const pathParts = [rootName, ...selectedFile.name.split('/')];
    
    return pathParts.map((part, index) => {
      const isLast = index === pathParts.length - 1;
      const path = pathParts.slice(0, index + 1).join('/');

      return (
        <React.Fragment key={path}>
          {index > 0 && <BreadcrumbSeparator />}
          <BreadcrumbItem>
            {isLast ? (
              <BreadcrumbPage>{part}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href="#">{part}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </React.Fragment>
      );
    });
  };

  if (!folderHandle) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert className="w-[400px]">
          <FolderOpen className="h-4 w-4" />
          <AlertTitle>No folder selected</AlertTitle>
          <AlertDescription>
            Please select a folder to start working with files.
          </AlertDescription>
          <Button 
            onClick={pickFolder} 
            className="mt-4"
          >
            Select Folder
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-8 shrink-0 items-center gap-2 border-b px-4">
          <Breadcrumb>
            <BreadcrumbList>
              {renderBreadcrumbs()}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4">
          <div className=" flex-1 rounded-xl bg-muted/50 "> 
            <RichTextEditorDemo
              content={selectedFile?.content ?? ""}
              fileHandle={selectedFile?.handle ?? null}
              onUpdateContent={setFileContent}
              onSave={saveFile}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function HomePage() {
  return (
    <FilesProvider>
      <PageContent />
    </FilesProvider>
  );
}
