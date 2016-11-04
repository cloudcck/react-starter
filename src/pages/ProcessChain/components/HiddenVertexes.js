import React, { PureComponent } from 'react';

class HiddenVertexes extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { hiddenNodes, referenceObject} = this.props;
    // <div >
    //   {hiddenNodes.map(n => <span className="label label-success" key={n} onClick={() => { this.reAddVertex(n) } }>{this.props.chains.objects[n].label}</span>)}
    // </div>
    return (
      <div className="hidden-nodes">
        {hiddenNodes.map(n => {
          const obj = referenceObject[n];
          const label = obj.label;
          const clazz = `label ${obj.isSuspicious ? 'label-danger' : 'label-default'}`;
          return (
            <span className={clazz} key={n} onClick={() => { this.props.reAddVertex(n) } }>{label}</span>)
        }
        )}
      </div>
    );
  }
}

export default HiddenVertexes;