import Link from 'next/link';
import "./resourceCard.css";

interface ResourceCardProps {
    resource: {
        _id: string;
        title: string;
        description?: string;
        quantity: number;
        category: string;
        owner: { username: string };
    };
    isOwner?: boolean;
    onDelete?: (id: string) => void;
}

function ResourceCard({ resource, isOwner, onDelete }: ResourceCardProps) {
    return (
        <div className={`ResourceCard card`}>
            <div className="card-body">
                <div className="ResourceCard-header">
                    <h2 className="card-title">{resource.title}</h2>
                    <div className="ResourceCard-badges">
                        <span className="badge badge-quantity">qty {resource.quantity}</span>
                        <span className="badge badge-category">{resource.category}</span>
                    </div>
                </div>
                <div className="ResourceCard-body">
                    <p className="card-text">{resource.description}</p>
                </div>
            </div>
            <div className="ResourceCard-footer">
                <p>found in {resource.owner.username}&apos;s shed</p>
                <div className="ResourceCard-footer-links">
                    <Link href={`/users/${resource.owner.username}`} className="footer-link">view shed</Link>
                    {isOwner && (
                        <>
                            <Link href={`/resources/${resource._id}/edit`} className="footer-link">edit</Link>
                            <button type="button" onClick={() => onDelete?.(resource._id)} className="footer-link">delete</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResourceCard;
