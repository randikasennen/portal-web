import React from 'react';
import DataGrid, { Column, Pager, Paging, FilterRow, Editing } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import MultipleDataReducer from '../../components/multiple-data-reducer/multiple-data-reducer';

import './schools.scss';

const schools = require('./schools.json');

const viewButton = (row) => {
  return (
    <Button
      text="View"
      elementAttr={{ class: "view-button" }}
      stylingMode="contained"
      onClick={() => console.log(row)}
    />
  )
}

export default () => {
  return (
    <React.Fragment>
      <h2 className={'content-block'}>Schools in Colombo Zone</h2>

      <DataGrid
        className={'dx-card wide-card'}
        dataSource={schools.data}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
      >
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <FilterRow visible={true} />
        <Editing
          allowUpdating={true}
          allowAdding={false}
          allowDeleting={false}
          mode="row"
        />

        <Column
          dataField={'id'}
          caption={'ID'}
        />
        <Column
          dataField={'code'}
          caption={'Census ID'}
        />
        <Column
          dataField={'name'}
          caption={'Name'}
        />
        <Column
          dataField={'address'}
          caption={'Address'}
        />
        <Column
          dataField={'postal_code'}
          caption={'Postal Code'}
          hidingPriority={3}
        />
        <Column
          dataField={'contact_person'}
          caption={'Contact Person'}
          hidingPriority={4}
        />
        <Column
          dataField={'fax'}
          caption={'Fax'}
          hidingPriority={1}
        />
        <Column
          dataField={'email'}
          caption={'Email'}
          hidingPriority={2}
        />
        <Column
          caption={'TV Channels'}
          cellRender={(row) => { return <MultipleDataReducer /> }}
        />
        <Column
          caption={'Radio Channels'}
          cellRender={(row) => { return <MultipleDataReducer /> }}
        />
        <Column
          caption={'Students'}
          cellRender={(row) => viewButton(row)}
        />

      </DataGrid>
    </React.Fragment>
  )
}