import React, { PureComponent } from 'react';
import { OBJECT_TYPE, META, OPERATION } from '../ProcessChainDef';
class VertexDetail extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {

    if (this.props.data) {
      const {label, metaHashId, detail, relatedObjects} = this.props.data;
      return (
        <div>
          <div>
            Detail:<hr />
            {OBJECT_TYPE[detail.objectType]}- {label}
            {detail.metaHashId.map(hashId => {
              let {metaType, metaValue} = this.props.metaData[hashId];
              <div>
                <span className="label label-default">{META[metaType]}</span>
                <span>{metaValue}</span>
              </div>
            })}
          </div>
          <div>
            Related Objects: <hr />
            {relatedObjects.map(r => {
              let l = _.get(this.props.metaData, r.objectName).metaValue;
              let op = OPERATION[r.operation];
              let t = OBJECT_TYPE[r.objectType];
              let key = 0;
              return (
                <div>
                  <div>
                    <div><span className="label label-info">{op}</span>{t}</div>
                    {r.metaHashId.map(id => {
                      let _metaType = this.props.metaData[id].metaType;
                      return (<div key={key++}><span className="label label-default">{META[_metaType]}</span>{this.props.metaData[id].metaValue}</div>)
                    }
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
}
export default VertexDetail;