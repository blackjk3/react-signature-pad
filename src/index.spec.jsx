import { mount } from 'enzyme';
import React from 'react';

import SignatureCanvas from '.';
import { propsF, dotF } from '../test-utils/fixtures';

it('mounts canvas and instance properly', () => {
  const wrapper = mount(<SignatureCanvas />);
  expect(wrapper.exists('canvas')).toBe(true);
  const instance = wrapper.instance();
  expect(instance.isEmpty()).toBe(true);
});

describe('setting and updating props', () => {
  it('should set default props', () => {
    const instance = mount(<SignatureCanvas />).instance();
    expect(instance.props).toStrictEqual(SignatureCanvas.defaultProps);
  });

  it('should set initial mount props and SigPad options', () => {
    const instance = mount(<SignatureCanvas {...propsF.all} />).instance();
    const sigPad = instance.getSignaturePad();

    expect(instance.props).toMatchObject(propsF.all);
    expect(sigPad).toMatchObject(propsF.sigPadOptions);
  });

  it('should update props and SigPad options', () => {
    const wrapper = mount(<SignatureCanvas />);
    const instance = wrapper.instance();
    const sigPad = instance.getSignaturePad();

    // default props and options should not match new ones
    expect(instance.props).not.toMatchObject(propsF.all);
    expect(sigPad).not.toMatchObject(propsF.sigPadOptions);

    // should match when updated
    wrapper.setProps(propsF.all);
    expect(instance.props).toMatchObject(propsF.all);
    expect(sigPad).toMatchObject(propsF.sigPadOptions);
  });
});

describe('SigCanvas wrapper methods return equivalent to SigPad', () => {
  const rSigPad = mount(<SignatureCanvas />).instance();
  const sigPad = rSigPad.getSignaturePad();

  it('toData should be equivalent', () => {
    const rData = rSigPad.toData();
    expect(rData).toStrictEqual([]);
    expect(rData).toBe(sigPad.toData());
  });

  it('fromData should be equivalent', () => {
    rSigPad.fromData(dotF.data);
    const rData = rSigPad.toData();
    expect(rData).toBe(dotF.data);
    expect(rData).toBe(sigPad.toData());

    // test reverse as both froms should be equivalent
    sigPad.fromData(dotF.data);
    const data = sigPad.toData();
    expect(rData).toBe(data);
    expect(rSigPad.toData()).toBe(data);
  });

  it('toDataURL should be equivalent', () => {
    rSigPad.fromData(dotF.data);
    expect(rSigPad.toDataURL()).toBe(sigPad.toDataURL());
    expect(rSigPad.toDataURL('image/jpg')).toBe(sigPad.toDataURL('image/jpg'));
    expect(rSigPad.toDataURL('image/jpg', 0.7)).toBe(sigPad.toDataURL('image/jpg', 0.7));
    expect(rSigPad.toDataURL('image/svg+xml')).toBe(sigPad.toDataURL('image/svg+xml'));
  });

  it('fromDataURL should be equivalent', () => {
    // convert data fixture to dataURL
    rSigPad.fromData(dotF.data);
    const dotFDataURL = rSigPad.toDataURL();

    rSigPad.fromDataURL(dotFDataURL);
    const rDataURL = rSigPad.toDataURL();
    expect(rDataURL).toBe(dotFDataURL);
    expect(rDataURL).toBe(sigPad.toDataURL());

    // test reverse as both froms should be equivalent
    sigPad.fromDataURL(dotFDataURL);
    const dataURL = sigPad.toDataURL();
    expect(rDataURL).toBe(dataURL);
    expect(rSigPad.toDataURL()).toBe(dataURL);
  });

  it('isEmpty & clear should be equivalent', () => {
    rSigPad.fromData(dotF.data);
    let isEmpty = rSigPad.isEmpty();
    expect(isEmpty).toBe(false);
    expect(isEmpty).toBe(sigPad.isEmpty());

    // both empty after clear
    rSigPad.clear();
    isEmpty = rSigPad.isEmpty();
    expect(isEmpty).toBe(true);
    expect(isEmpty).toBe(sigPad.isEmpty());

    // test reverse
    sigPad.fromData(dotF.data);
    isEmpty = rSigPad.isEmpty();
    expect(isEmpty).toBe(false);
    expect(isEmpty).toBe(sigPad.isEmpty());

    // both empty after internal sigPad clear
    sigPad.clear();
    isEmpty = rSigPad.isEmpty();
    expect(isEmpty).toBe(true);
    expect(isEmpty).toBe(sigPad.isEmpty());
  });
});

// comes after props and wrapper methods as it uses both
describe('get methods', () => {
  const instance = mount(
    <SignatureCanvas canvasProps={dotF.canvasProps} />,
  ).instance();
  instance.fromData(dotF.data);

  it('getCanvas should return the same underlying canvas', () => {
    const canvas = instance.getCanvas();
    expect(instance.toDataURL()).toBe(canvas.toDataURL());
  });

  it('getTrimmedCanvas should return a trimmed canvas', () => {
    const trimmed = instance.getTrimmedCanvas();
    // expect(trimmed.width).toBe(dotF.trimmedSize.width)
    // expect(trimmed.height).toBe(dotF.trimmedSize.height)
    // canvas was mocked with jest-canvas-mock
    expect(trimmed.width).toBe(1);
    expect(trimmed.height).toBe(1);
  });
});

// comes after props, wrappers, and gets as it uses them all
describe('canvas resizing', () => {
  const wrapper = mount(<SignatureCanvas />);
  const instance = wrapper.instance();
  const canvas = instance.getCanvas();

  it('should clear on resize', () => {
    instance.fromData(dotF.data);
    expect(instance.isEmpty()).toBe(false);

    window.resizeTo(500, 500);
    expect(instance.isEmpty()).toBe(true);
  });

  it('should not clear when clearOnResize is false', () => {
    wrapper.setProps({ clearOnResize: false });

    instance.fromData(dotF.data);
    expect(instance.isEmpty()).toBe(false);

    window.resizeTo(500, 500);
    expect(instance.isEmpty()).toBe(false);
  });

  const size = { width: 100, height: 100 };
  it('should not change size if fixed width & height', () => {
    // reset clearOnResize back to true after previous test
    wrapper.setProps({ clearOnResize: true, canvasProps: size });
    window.resizeTo(500, 500);

    expect(canvas.width).toBe(size.width);
    expect(canvas.height).toBe(size.height);
  });

  it('should change size if no width or height', () => {
    wrapper.setProps({ canvasProps: {} });
    window.resizeTo(500, 500);

    expect(canvas.width).not.toBe(size.width);
    expect(canvas.height).not.toBe(size.height);
  });

  it('should partially change size if one of width or height', () => {
    wrapper.setProps({ canvasProps: { width: size.width } });
    window.resizeTo(500, 500);

    expect(canvas.width).toBe(size.width);
    expect(canvas.height).not.toBe(size.height);

    // now do height instead
    wrapper.setProps({ canvasProps: { height: size.height } });
    window.resizeTo(500, 500);

    expect(canvas.width).not.toBe(size.width);
    expect(canvas.height).toBe(size.height);
  });
});

// comes after wrappers and resizing as it uses both
describe('on & off methods', () => {
  const wrapper = mount(<SignatureCanvas />);
  const instance = wrapper.instance();

  it('should not clear when off, should clear when back on', () => {
    instance.fromData(dotF.data);
    expect(instance.isEmpty()).toBe(false);

    instance.off();
    window.resizeTo(500, 500);
    expect(instance.isEmpty()).toBe(false);

    instance.on();
    window.resizeTo(500, 500);
    expect(instance.isEmpty()).toBe(true);
  });

  it('should no longer fire after unmount', () => {
    // monkey-patch on with a mock to tell if it were called, as there's no way
    // to check what event listeners are attached to window
    instance._on = instance.on;
    instance.on = jest.fn(instance._on);

    wrapper.unmount();
    window.resizeTo(500, 500);
    expect(instance.on).not.toBeCalled();
  });
});
