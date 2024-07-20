import React, { useState } from 'react';
import Billing from './billing';
import Address from './addresses';

const tabs = [
    {
        id: 'tab1',
        title: 'Billing Address',
        component: <Billing />
    },
    {
        id: 'tab2',
        title: 'Shipping Address',
        component: <Address />
    },
];

function AddressTabs() {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <div className='ml-5'>
            <div className="tab-buttons my-5">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`flex-1 p-3 mr-4 mt-5 text-sm rounded bg-[#003863] font-semibold text-white ${tab.id === activeTab ? 'bg-rc-brand-primary text-white' : ''
                            } hover: opacity-80 `}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {tabs.find(tab => tab.id === activeTab).component}
            </div>
        </div>
    );
}


export default AddressTabs;