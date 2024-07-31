interface InfoCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, description, icon }) => (
    <div className="p-4 bg-white border rounded-lg shadow-sm flex items-center">
        {icon}
        <div className='ml-3'>
            <h3 className="text-lg font-semibold text-[#757575]">{title}</h3>
            <p className="text-[#868686] text">{description}</p>
        </div>
    </div>
);

export default InfoCard;