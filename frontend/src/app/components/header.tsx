"use client"
import Image from "next/image";
import { Button } from "primereact/button";
import { useState } from "react";

interface HeaderComponentProps {
    className?: string;
    onHomeClick: () => void;
    isHomeActive: boolean;
    onSidebarToggle: () => void;
}

const HeaderComponent = ({ onHomeClick, onSidebarToggle }: HeaderComponentProps) => {

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
            <Button
                icon="pi pi-delete-left"
                label="Clear"
                severity="secondary"
                onClick={onHomeClick}
            />
        </div>
    )
}

export default HeaderComponent;