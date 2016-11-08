import React, { PureComponent } from 'react';
import { OBJECT_TYPE, META, OPERATION } from '../ProcessChainDef';
class VertexRelatedObjects extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const {data, metaData} = this.props;
    // {relatedObjects.map(r => {
    //               let l = _.get(this.props.metaData, r.objectName).metaValue;
    //               let op = OPERATION[r.operation];
    //               let t = OBJECT_TYPE[r.objectType];
    //               let childId = 0, key = 0;
    //               return (
    //                 <div key={++childId}>
    //                   <div><span className="label label-info">{op}</span>{t}</div>
    //                   {r.metaHashId.map(id => {
    //                     let _metaType = this.props.metaData[id].metaType;
    //                     return (<div key={++key}>
    //                       <span className="label label-default">{META[_metaType]}</span>{this.props.metaData[id].metaValue}
    //                     </div>)
    //                   }
    //                   )}
    //                 </div>
    //               );
    //             })}
    let keyId = 0;
    return (
      <div>
        {data.map((d) =>
          (
            <div key={++keyId}>
              <span className="label label-info">{d.operation}</span>
              <span className="label label-default">{d.objectType}</span>
              {d.metaHashId.map(hashId => (
                <div key={hashId}>
                  <span className="label label-default">{META[metaData[hashId].metaType]}</span>
                  <span>{metaData[hashId].metaValue}</span>
                </div>))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

export default VertexRelatedObjects;