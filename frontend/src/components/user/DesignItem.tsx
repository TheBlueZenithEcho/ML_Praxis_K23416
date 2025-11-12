// src/components/DesignItem.tsx
import React from "react";
import { Link } from "react-router";

interface Design {
    id: number;
    img: string;
    name: string;
    designer: string;
    "type room": string;
}

interface Props {
    data: Design;
    onRemove: () => void;
}

const DesignItem: React.FC<Props> = ({ data, onRemove }) => {
    return (
        <div className="flex items-center gap-3 mb-4">
            <img src={data.img} alt={data.name} className="w-16 h-12 object-cover rounded" />
            <div className="flex-1">
                <Link to={`/design/${data.id}`} className="font-medium block">{data.name}</Link>
                <p className="text-xs text-gray-500">By {data.designer}</p>
            </div>
            <button onClick={onRemove} className="text-red-500">Remove</button>
        </div>
    );
};

export default DesignItem;
