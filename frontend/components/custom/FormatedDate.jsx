"use client"


const RelativeTime = ({ date, color }) => {
    const getRelativeTime = (date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return 'now';
        }
    };

    return <span className={`${color} text-[12px]`}>{getRelativeTime(date)}</span>;
};

export default RelativeTime;