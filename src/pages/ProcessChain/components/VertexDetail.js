import React, { PureComponent } from 'react';
import { OBJECT_TYPE, META, OPERATION } from '../ProcessChainDef';
import VertexRelatedObjects from './VertexRelatedObjects';
class VertexDetail extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {

    if (this.props.data) {
      const {label, metaHashId, detail, relatedObjects} = this.props.data;
      return (
        <div className="vertex-detail">
          <div>
            {OBJECT_TYPE[detail.objectType]}- {label}
            {detail.metaHashId.map(hashId => {
              let {metaType, metaValue} = this.props.metaData[hashId];
              <div key={hashId}>
                <span className="label label-default">{META[metaType]}</span>
                <span>{metaValue}</span>
              </div>
            })}
          </div>
          <div>
            <VertexRelatedObjects data={relatedObjects} metaData={this.props.metaData} />
          </div>
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
}
export default VertexDetail;