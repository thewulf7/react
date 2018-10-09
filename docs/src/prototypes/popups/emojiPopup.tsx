import React from 'react'
import { Button, Popup, Grid, Image, Input } from '@stardust-ui/react'
import * as _ from 'lodash'

const imageStyle = {
  width: '100%',
}

const imageButtonStyles = {
  minWidth: '56px',
  height: '56px',
  padding: '0',
  background: '#fff',
}

const images = [
  {
    key: 'ade',
  },
  {
    key: 'chris',
  },
  {
    key: 'christian',
  },
  {
    key: 'daniel',
  },
  {
    key: 'elliot',
  },
  {
    key: 'elyse',
    src: 'public/images/avatar/large/elyse.png',
  },
  {
    key: 'helen',
  },
  {
    key: 'jenny',
  },
  {
    key: 'joe',
  },
  {
    key: 'justen',
  },
  {
    key: 'kristy',
    src: 'public/images/avatar/large/kristy.png',
  },
  {
    key: 'laura',
  },
  {
    key: 'matt',
  },
  {
    key: 'molly',
    src: 'public/images/avatar/large/molly.png',
  },
  {
    key: 'matthew',
    src: 'public/images/avatar/large/matthew.png',
  },
  {
    key: 'nan',
  },
  {
    key: 'patrick',
    src: 'public/images/avatar/large/patrick.png',
  },
  {
    key: 'nom',
  },
  {
    key: 'rachel',
    src: 'public/images/avatar/large/rachel.png',
  },
  {
    key: 'stevie',
  },
  {
    key: 'steve',
  },
  {
    key: 'tom',
  },
  {
    key: 'veronika',
  },
]

const handleSelection = e => {
  if (!e.target) return
  const img = e.target.nodeName !== 'IMG' ? e.target.querySelector('img') : e.target
  const selectedItem = img && img.getAttribute('aria-label')
  if (!selectedItem) return
  alert(`The image was selected "${selectedItem}"`)
}

const renderImages = () => {
  return _.map(images, (image, index) => (
    <li key={image.key}>
      <Button styles={imageButtonStyles} onClick={handleSelection} title={`emoji of ${image.key}`}>
        <Image
          styles={imageStyle}
          fluid
          src={image.src ? image.src : `public/images/avatar/large/${image.key}.jpg`}
        />
      </Button>
    </li>
  ))
}

const EmojiPopup = () => (
  <Popup
    position="below"
    trigger={<Button icon="smile" aria-label="Choose an emoji." />}
    content={
      <div
        aria-label="Choose an emoji. Press Enter key to insert emoji."
        role="dialog"
        aria-modal="true"
      >
        {<Input styles={{ marginBottom: '5px' }} fluid icon="search" placeholder="Search..." />}
        {<br />}
        {
          <Grid
            as="ul"
            styles={{
              width: '320px',
              listStyle: 'none',
              padding: '0',
              margin: '0',
              gridRowGap: '10px',
            }}
            columns="5"
            content={renderImages()}
          />
        }
      </div>
    }
  />
)

export default EmojiPopup