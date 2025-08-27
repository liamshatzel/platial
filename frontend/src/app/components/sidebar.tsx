import { Button } from "primereact/button";

interface SidebarProps {
    isVisible: boolean;
    onToggle: () => void;
    selectedDrawType: string;
    onDrawTypeChange: (type: string) => void;
}

export default function Sidebar({ isVisible, onToggle, selectedDrawType, onDrawTypeChange }: SidebarProps) {
    const drawTypes = [
        { type: 'Polygon', icon: 'pi pi-star', label: 'Polygon' },
        { type: 'LineString', icon: 'pi pi-minus', label: 'Line' },
        { type: 'Circle', icon: 'pi pi-circle', label: 'Circle' },
        { type: 'Point', icon: 'pi pi-map-marker', label: 'Point' },
    ];

    return (
        <div
            className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${isVisible ? 'w-80' : 'w-0'
                } overflow-hidden`}
        >
            <div className="p-4 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-md font-semibold text-black">Tools</h2>
                </div>
                <div className="flex flex-col gap-2">
                    {drawTypes.map((drawType) => (
                        <Button
                            key={drawType.type}
                            icon={drawType.icon}
                            label={drawType.label}
                            severity={selectedDrawType === drawType.type ? "success" : "secondary"}
                            className="w-full justify-start"
                            onClick={() => onDrawTypeChange(drawType.type)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}