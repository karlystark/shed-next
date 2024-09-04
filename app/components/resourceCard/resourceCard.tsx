import Link from 'next/link';
import Image from 'next/image';
import "./resourceCard.css";


function ResourceCard({ resource }) {
    return (
        <div className={`ResourceCard card`}>
            <img src={`/${resource.image}`} alt="" className="card-img-top" />
            <div className="card-body">
                <div className="ResourceCard-header">
                    <h2 className="card-title">{resource.title}</h2>
                    <p className="card-subtitle mb-2">quantity: {resource.quantity}</p>
                </div>
                <div className="ResourceCard-body">
                    <p className="card-text">{resource.description}</p>
                </div>
                <div className="ResourceCard-footer">
                    <p>found in {resource.user}'s shed</p>
                    <Link href={`/users/${resource.user}`} className="footer-link">
                        <img src="/ksnpr.jpg" alt={resource.user} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ResourceCard;