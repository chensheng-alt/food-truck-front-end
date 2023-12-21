import QueryPageTable from '@/components/query-page-table/QueryPageTable';
import { PopupFormProps } from '@/components/query-page-table/QueryPageTableProps';
import { SchemaColumnProps } from '@/components/types/index';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { Label, Map, Marker, ZoomControl } from 'react-bmapgl';

const QueryFoodTrucks: React.FC = () => {
  const [isShowMap, setIsShowMap] = useState(false);
  const [resultData, setResultData] = useState<any>([]);
  const [mapCenterPoint, setMapCenterPoint] = useState<BMapGL.Point>(
    new BMapGL.Point(0, 0),
  );

  // define table columns
  const columns: SchemaColumnProps[] = [
    {
      title: 'locationId',
      key: 'locationId',
      dataIndex: 'locationId',
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
      hideInDescriptions: true,
    },
    {
      title: 'No.',
      key: 'no',
      dataIndex: 'index',
      valueType: 'index',
      width: 40,
      align: 'center',
      hideInDescriptions: true,
    },
    {
      title: 'Applicant',
      key: 'applicant',
      dataIndex: 'applicant',
      valueType: 'text',
      width: 100,
    },
    {
      title: 'Facility Type',
      key: 'facilityType',
      dataIndex: 'facilityType',
      valueType: 'autoComplete',
      width: 100,
    },
    {
      title: 'CNN',
      key: 'cnn',
      dataIndex: 'cnn',
      valueType: 'text',
      hideInSearch: true,
      width: 100,
    },
    {
      title: 'Location Desc',
      key: 'locationDescription',
      dataIndex: 'locationDescription',
      valueType: 'text',
      width: 200,
    },
    {
      title: 'Address',
      key: 'address',
      dataIndex: 'address',
      valueType: 'text',
      width: 200,
    },
    {
      title: 'Block Lot',
      key: 'blockLot',
      dataIndex: 'blockLot',
      valueType: 'text',
      width: 100,
    },
    {
      title: 'Permit',
      key: 'permit',
      dataIndex: 'permit',
      valueType: 'text',
      width: 100,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        APPROVED: { text: 'APPROVED' },
        EXPIRED: { text: 'EXPIRED' },
        ISSUED: { text: 'ISSUED' },
        REQUESTED: { text: 'REQUESTED' },
        SUSPEND: { text: 'SUSPEND' },
      },
      width: 100,
    },
    {
      title: 'Food Items',
      key: 'foodItems',
      dataIndex: 'foodItems',
      valueType: 'text',
      width: 300,
    },
    {
      title: 'Days Hours',
      key: 'daysHours',
      dataIndex: 'daysHours',
      valueType: 'text',
      width: 150,
    },
    {
      title: 'Approved Date',
      key: 'approved',
      dataIndex: 'approved',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
    },
    {
      title: 'received Date',
      key: 'received',
      dataIndex: 'received',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
    },
    {
      title: 'Prior Permit',
      key: 'priorPermit',
      dataIndex: 'priorPermit',
      valueType: 'select',
      valueEnum: {
        true: { text: 'Yes' },
        false: { text: 'No' },
      },
      width: 150,
      hideInSearch: true,
    },
    {
      title: 'Approved Date',
      key: 'approved',
      dataIndex: 'approved',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
    },
    {
      title: 'Expiration Date',
      key: 'expirationDate',
      dataIndex: 'expirationDate',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
    },
    {
      title: 'Location',
      key: 'location',
      dataIndex: 'location',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
    },
    {
      title: 'Fire Prevention Districts',
      key: 'firePreventionDistricts',
      dataIndex: 'firePreventionDistricts',
      valueType: 'text',
      width: 100,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: 'Police Districts',
      key: 'policeDistricts',
      dataIndex: 'policeDistricts',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: 'Supervisor Districts',
      key: 'supervisorDistricts',
      dataIndex: 'supervisorDistricts',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: 'Zip',
      key: 'zipCodes',
      dataIndex: 'zipCodes',
      valueType: 'text',
      width: 100,
      hideInSearch: true,
    },
    {
      title: 'Neighborhoods',
      key: 'neighborhoods',
      dataIndex: 'neighborhoods',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
      hideInTable: true,
    },

    // action buttons
    {
      title: 'detail',
      key: 'detail',
      valueType: 'option',
      mode: 'popup',
    },
  ];

  // toolbars
  const toolbars = [
    {
      title: 'Location',
      key: 'location',
      mode: 'call',
      onClick: () => {
        setIsShowMap(!isShowMap);
      },
    },
  ];

  const popupForms: PopupFormProps[] = [
    {
      key: 'detail',
      title: 'Food Truck',
      layoutType: 'ModalDescriptionForm',
      triggerKey: 'detail',
      columns: [...columns] as SchemaColumnProps[],
      requestUrl: '/foodTruck/detail',
      requestMethod: 'GET',
      requestParams: 'locationId',
    },
  ];

  return (
    <>
      <QueryPageTable
        rowKey="locationId"
        search={{ labelWidth: 120 }}
        columns={columns}
        toolbars={toolbars}
        requestMethod="POST"
        requestUrl="/foodTruck/queryFoodTrucks"
        popupForms={popupForms}
        onLoadCompleted={(queryResultData: any) => {
          setResultData(queryResultData);
          if (queryResultData.length > 0) {
            setMapCenterPoint(
              new BMapGL.Point(
                queryResultData[0].longitude,
                queryResultData[0].latitude,
              ),
            );
          }
        }}
      />
      <Modal
        title="Truck Locations"
        width="80%"
        open={isShowMap}
        onCancel={() => setIsShowMap(false)}
        footer={[
          <Button key="cancelMapModal" onClick={() => setIsShowMap(false)}>
            Return
          </Button>,
        ]}
      >
        <Map style={{ height: '600px' }} center={mapCenterPoint} zoom={16}>
          {resultData?.map((eachData: any, index: number) => {
            return (
              <>
                <Marker
                  position={
                    new BMapGL.Point(eachData.longitude, eachData.latitude)
                  }
                  icon="loc_blue"
                />
                <Label
                  style={{ color: 'blue', border: 0 }}
                  position={
                    new BMapGL.Point(eachData.longitude, eachData.latitude)
                  }
                  offset={new BMapGL.Size(10, -5)}
                  text={eachData.applicant}
                />
              </>
            );
          })}
          <ZoomControl />
        </Map>
      </Modal>
    </>
  );
};

export default QueryFoodTrucks;
