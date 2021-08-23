import * as React from 'react'

// import invariant from 'invariant'

import { unregisterEvents, applyUpdatersToPropsAndRegisterEvents } from '../../utils/helper'

import MapContext from '../../map-context'
import { noop } from '../../utils/noop'

const eventMap = {
  onTilesLoaded: 'tilesloaded',
}

const updaterMap = {
  opacity(instance: google.maps.ImageMapType, opacity: number): void {
    instance.setOpacity(opacity)
  },
}

interface ImageMapTypeState {
  imageMapType: google.maps.ImageMapType | null
}

export interface ImageMapTypeProps {
  options: google.maps.ImageMapTypeOptions
  /** The opacity of the overlay, expressed as a number between 0 and 1. Optional. Defaults to 1. */
  opacity?: number
  /** This event is fired when the visible tiles have finished loading. */
  onTilesLoaded?: () => void
  /** This callback is called when the ImageMapType instance has loaded. It is called with the ImageMapType instance. */
  onLoad?: (imageMapType: google.maps.ImageMapType) => void
  /** This callback is called when the component unmounts. It is called with the ImageMapType instance. */
  onUnmount?: (imageMapType: google.maps.ImageMapType) => void
}

export class ImageMapType extends React.PureComponent<ImageMapTypeProps, ImageMapTypeState> {

  public static defaultProps = {
    onLoad: noop,
  }

  static contextType = MapContext
  declare context: React.ContextType<typeof MapContext> 

  registeredEvents: google.maps.MapsEventListener[] = []

  state: ImageMapTypeState = {
    imageMapType: null,
  }

  setImageMapTypeCallback = (): void => {
    if (this.state.imageMapType !== null && this.props.onLoad) {
      this.props.onLoad(this.state.imageMapType)
    }
  }

  componentDidMount(): void {
    // invariant(
    //   !!this.props.url || !!this.props.bounds,
    //   `For GroundOverlay, url and bounds are passed in to constructor and are immutable after instantiated. This is the behavior of Google Maps JavaScript API v3 ( See https://developers.google.com/maps/documentation/javascript/reference#GroundOverlay) Hence, use the corresponding two props provided by \`react-google-maps-api\`, url and bounds. In some cases, you'll need the GroundOverlay component to reflect the changes of url and bounds. You can leverage the React's key property to remount the component. Typically, just \`key={url}\` would serve your need. See https://github.com/tomchentw/react-google-maps/issues/655`
    // )

    const imageMapType = new google.maps.ImageMapType(this.props.options)
    console.log("imageMapType:", imageMapType)
    this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
      updaterMap,
      eventMap,
      prevProps: {},
      nextProps: this.props,
      instance: imageMapType,
    })

    // add the overlay to the map
    this.context!.overlayMapTypes.push(imageMapType)

    this.setState(() => {
      return {
        imageMapType,
      }
    }, this.setImageMapTypeCallback)
  }

  componentDidUpdate(prevProps: ImageMapTypeProps): void {
    if (this.state.imageMapType !== null) {
      unregisterEvents(this.registeredEvents)

      this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
        updaterMap,
        eventMap,
        prevProps,
        nextProps: this.props,
        instance: this.state.imageMapType,
      })
    }
  }

  componentWillUnmount(): void {
    if (this.state.imageMapType) {
      if (this.props.onUnmount) {
        this.props.onUnmount(this.state.imageMapType)
      }
      
      let layerIdx: number = -1
      this.context!.overlayMapTypes.forEach((mapType, i) => {
        if (mapType === this.state.imageMapType) {
          layerIdx = i
        }
      })
      if (layerIdx !== -1) {
        this.context!.overlayMapTypes.removeAt(layerIdx)
      }
    }
  }

  render(): React.ReactNode {
    return null
  }
}