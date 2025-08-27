"use client"
import Image from "next/image";
import { Button } from "primereact/button";
import { FileUpload } from 'primereact/fileupload';

import { Toast } from 'primereact/toast';
import { useRef } from "react";

interface HeaderComponentProps {
    className?: string;
    onHomeClick: () => void;
    isHomeActive: boolean;
    onSidebarToggle: () => void;
    onUpload: (file: File) => void;
}

const HeaderComponent = ({ onHomeClick, onSidebarToggle, onUpload }: HeaderComponentProps) => {
    const toast = useRef<Toast>(null);

    const handleFileSelect = (event: any) => {
        const file = event.files[0];
        if (file) {
            onUpload(file);
            if (toast.current) {
                toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
            }
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "10px", width: "100%", backgroundColor: "white" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Image src="/logo.png" alt="Platial Logo" width={50} height={50} />
                <Button
                    icon="pi pi-bars"
                    onClick={onSidebarToggle}
                    severity="secondary"
                    className="mr-2"
                />
            </div>
            <div style={{ display: "flex", width: "15%", justifyContent: "space-between" }}>

                <div className="card flex justify-content-center" style={{ width: "100px" }}>
                    <Toast ref={toast}></Toast>
                    <FileUpload
                        mode="basic"
                        name="demo[]"
                        accept=".shp,.geojson,.json,.kml,.gpx"
                        maxFileSize={10000000}
                        onSelect={handleFileSelect}
                        chooseLabel="Upload"
                        auto
                        customUpload
                    />
                </div>
                <Button
                    icon="pi pi-delete-left"
                    label="Clear"
                    severity="secondary"
                    onClick={onHomeClick}
                />

            </div>

        </div>
    )
}

export default HeaderComponent;
