export const BusinessUnit = ({data}) => {
    console.log("BusinessUnit_filteredAssociates : ",data)
    // console.log("BusinessUnit_filteredAssociates[0] : ",filteredAssociates[0])
  return (
    <div>
      {data?.map((customerGroup, index) => (
        <div key={index}>
          {customerGroup?.map((customerData, i) => (
            <div key={i}>              
                {/* {Object.entries(customerData.customer.obj).map(([key, value]) => ( */}
                  <tr key={index} className="border-b text-sm">
                
                <td className="px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                  {customerData?.customer?.obj?.email}
                </td>
                <td className="px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                  {customerData?.customer?.obj?.firstName}
                </td>
                <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                  {customerData?.customer?.obj?.lastName}
                </td>

                <td className="hidden whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:block lg:px-6">
                  {customerData?.associateRoleAssignments[0]?.associateRole?.key}
                </td>
              </tr>
                {/* ))} */}

            </div>
          ))}
        </div>
      ))}
    </div>
  )
  
  };


  