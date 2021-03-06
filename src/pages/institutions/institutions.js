import React, { useState } from 'react';
import DataGrid, { Column, Pager, Paging, FilterRow, Editing, Lookup } from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import { Button } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';

import './institutions.scss';
import { getInstitutions, setInstitution } from '../../api/institutions';
import { ViewBooleanComponent, EditBooleanComponent, ViewChannelsComponent, EditChannelsComponent } from '../../components';
import { TV_CHANNELS, RADIO_CHANNELS } from '../../options';

export default function Institutions(props) {
  const [editedRowUpdatedValues, setEditedRowUpdatedValues] = useState(null);

  const store = new CustomStore({
    key: 'id',
    load: async function() {
      return getInstitutions()
        .then((institutions) => { return institutions })
        .catch(() => notify("Internal server error. Failed to fetch data.", 'error', 3000))
    },
    update: async function() {
      return setInstitution(editedRowUpdatedValues)
        .then((response) => {
          switch(response.status) {
            case 200: notify("Updated successfully.", 'success', 3000); break;
            case 401: notify("Unauthorized attempt.", 'error', 3000); break;
            default : notify("Update failed.", 'error', 3000);
          }
          setEditedRowUpdatedValues(null);
        })
        .catch(() => notify("Internal server error. Could not perform update.", 'error', 3000))
    }
  })

  const handleOnSaving = (e) => {
    const changes = e.changes[0];

    if(changes === undefined) {
      notify("No changes made. Nothing to update.", 'info', 3000);
    }
    else{
      const dataSource = e.component.getDataSource();
      const rowData = dataSource._items.filter((object) => object.id === changes.key)[0];
      const updatedValues = getUpdatedValues(changes.data, rowData);

      if(validateAdditionalData(updatedValues.additional_data)) {
        setEditedRowUpdatedValues(updatedValues);
      }
      else {
        e.cancel = true;
      }
    }
  }

  const getUpdatedValues = (changes, rowData) => {
    const updatedValues = {
      id: rowData.id,
      additional_data: _updateAdditionalData(changes, rowData),
      tv_channels    : _updateValue(changes, rowData, 'tv_channels') || [],
      radio_channels : _updateValue(changes, rowData, 'radio_channels') || [],
    }

    return updatedValues;
  }

  const _updateAdditionalData = (changes, rowData) => {
    const additional_data = [
      'has_internet_connection',
      'has_electricity',
      'has_telephone'
    ]

    var additionalData = {};

    additional_data.forEach((key) => {
      additionalData[key] = _updateValue(changes.additional_data, rowData.additional_data, key)
    })

    return additionalData;
  }

  const _updateValue = (changes, rowData, key) => {
    if(changes && changes.hasOwnProperty(key)) { return changes[key] }
    if(rowData && rowData.hasOwnProperty(key)) { return rowData[key] }
    return null;
  }

  const validateAdditionalData = (additional_data) => {
    const { has_internet_connection, has_electricity, has_telephone } = additional_data;

    let requiredColumns = [];

    if(has_internet_connection === null) { requiredColumns.push(' Internet') }
    if(has_electricity === null)         { requiredColumns.push(' Electricity') }
    if(has_telephone === null)           { requiredColumns.push(' Telephone') }

    const requiredColumnsLength = requiredColumns.length;

    if(requiredColumnsLength) {
      const an = requiredColumnsLength == 1 ? "an " : "";
      const s = requiredColumnsLength > 1 ? "s" : "";
      const notification = "Please select " + an + "option" + s + " for" + requiredColumns.toString() + " column" + s + ".";
      
      notify(notification, 'error', 3000);
      return false;
    }

    return true;
  }

  return (
    <React.Fragment>
      <h2 className={'content-block'}>Institutions in Colombo Zone</h2>

      <DataGrid
        className={'dx-card wide-card'}
        dataSource={store}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        onSaving={handleOnSaving}
        onEditCanceled={() => notify("Edit cancelled.", 'info', 2000)}
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
          dataField={'code'}
          caption={'Census ID'}
          allowEditing={false}
        />

        <Column
          dataField={'name'}
          caption={'Name'}
          allowEditing={false}
        />

        <Column
          dataField={'address'}
          caption={'Address'}
          allowEditing={false}
          allowFiltering={false}
          hidingPriority={5}
        />

        <Column
          dataField={'postal_code'}
          caption={'Postal Code'}
          hidingPriority={3}
          allowEditing={false}
          allowFiltering={false}
        />

        <Column
          dataField={'contact_person'}
          caption={'Contact Person'}
          hidingPriority={4}
          allowEditing={false}
          allowFiltering={false}
        />

        <Column
          dataField={'fax'}
          caption={'Fax'}
          hidingPriority={1}
          allowEditing={false}
          allowFiltering={false}
        />

        <Column
          dataField={'email'}
          caption={'Email'}
          hidingPriority={2}
          allowEditing={false}
          allowFiltering={false}
        />

        <Column
          width={150}
          caption={'Internet'}
          dataField={'additional_data.has_internet_connection'}
          calculateCellValue={(rowData) => { return rowData.additional_data ? rowData.additional_data.has_internet_connection ? 'Yes' : 'No' : null}}
          cellRender={(row) => { return <ViewBooleanComponent value={row.data.additional_data && row.data.additional_data.has_internet_connection}/> }}
          editCellComponent={EditBooleanComponent}
          allowFiltering={false}
        >
          <Lookup dataSource={['Yes', 'No']} />
        </Column>

        <Column
          width={150}
          caption={'Electricity'}
          dataField={'additional_data.has_electricity'}
          calculateCellValue={(rowData) => { return rowData.additional_data ? rowData.additional_data.has_electricity ? 'Yes' : 'No' : null}}
          cellRender={(row) => { return <ViewBooleanComponent value={row.data.additional_data && row.data.additional_data.has_electricity}/> }}
          editCellComponent={EditBooleanComponent}
          allowFiltering={false}
        >
          <Lookup dataSource={['Yes', 'No']} />
        </Column>

        <Column
          width={150}
          caption={'Telephone'}
          dataField={'additional_data.has_telephone'}
          calculateCellValue={(rowData) => { return rowData.additional_data ? rowData.additional_data.has_telephone ? 'Yes' : 'No' : null}}
          cellRender={(row) => { return <ViewBooleanComponent value={row.data.additional_data && row.data.additional_data.has_telephone}/> }}
          editCellComponent={EditBooleanComponent}
          allowFiltering={false}
        >
          <Lookup dataSource={['Yes', 'No']} />
        </Column>

        <Column
          width={200}
          caption={'TV Channels'}
          dataField={'tv_channels'}
          filterOperations={['contains']}
          cellRender={(row) => { return <ViewChannelsComponent data={TV_CHANNELS} channels={row.data.tv_channels}/> }}
          editCellComponent={EditChannelsComponent}
          allowFiltering={false}
        >
          <Lookup
            dataSource={Object.entries(TV_CHANNELS).map(data => { return { id: data[0], name: data[1] }})}
            valueExpr="id"
            displayExpr="name"
          />
        </Column>

        <Column
          width={200}
          caption={'Radio Channels'}
          dataField={'radio_channels'}
          filterOperations={['contains']}
          cellRender={(row) => { return <ViewChannelsComponent data={RADIO_CHANNELS} channels={row.data.radio_channels}/> }}
          editCellComponent={EditChannelsComponent}
          allowFiltering={false}
        >
          <Lookup
            dataSource={Object.entries(RADIO_CHANNELS).map(data => { return { id: data[0], name: data[1] }})}
            valueExpr="id"
            displayExpr="name"
          />
        </Column>
        
        <Column
          caption={'Students'}
          cellRender={(row) => {
            return (
              <Button
                text="View"
                elementAttr={{ class: "view-button" }}
                stylingMode="contained"
                onClick={() => props.history.push({
                  pathname: '/students?institution_id=' + row.data.id,
                  state: { institution_name: row.data.name , classes :row.data.classes }
                })}
              />
            )
          }}
          allowEditing={false}
          allowFiltering={false}
        />

      </DataGrid>
    </React.Fragment>
  )
}
