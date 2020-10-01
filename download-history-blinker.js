'use strict'

const dlHistory = () =>({
    "items": [
        {
            "asset_family": "Creative",
            "asset_id": "701659966",
            "asset_type": "Image",
            "billing_country_code": "GBR",
            "collection_code": "ISI",
            "collection_info": {
                "id": 0,
                "name": "Signature"
            },
            "cost": "15 credits",
            "customer_id": 3009160,
            "download_agreement_id": 0,
            "download_by": "Simon Reynolds",
            "download_detail_id": 217203093,
            "download_id": 217203093,
            "download_product_type": "credits",
            "duplicate_count": 0,
            "i_stock_licenses": [
                "standard"
            ],
            "image_caption": "Oscars Red Carpet",
            "is_audio": false,
            "is_cancelable": false,
            "is_canceled": false,
            "is_pulled": false,
            "istock_collection": "signature_collection",
            "landing_url": "/pic/on-the-red-carpet-set-gm59966103-20822232?clarity=false",
            "license_type": "RM",
            "licensee": {
                "id": 1,
                "name": "Logic"
            },
            "media_type": "photo",
            "order_id": 0,
            "show_actions": false,
            "site_id": 441,
            "thumb_url": "https://media.some-server.com/oscars-id165966103?s=170x170",
            "unit_cost": 45.0
        },
        {
            "asset_family": "Creative",
            "asset_id": "165966104",
            "asset_type": "Image",
            "billing_country_code": "GBR",
            "collection_code": "ISI",
            "collection_info": {
                "id": 0,
                "name": "Signature"
            },
            "cost": "15 credits",
            "customer_id": 3009160,
            "download_agreement_id": 0,
            "download_by": "Simon Reynolds",
            "download_detail_id": 217203094,
            "download_id": 217203094,
            "download_product_type": "credits",
            "duplicate_count": 0,
            "i_stock_licenses": [
                "standard"
            ],
            "image_caption": "Vector File of Doodle Animal Icon Set",
            "is_audio": false,
            "is_cancelable": false,
            "is_canceled": false,
            "is_pulled": true,
            "istock_collection": "signature_collection",
            "landing_url": "/vector/farm-animal-icon-set-gm165966103-20822232?clarity=false",
            "license_type": "RF",
            "media_type": "illustration",
            "order_id": 0,
            "show_actions": false,
            "site_id": 441,
            "thumb_url": "https://media.somesvr-istockphoto.com/vectors/farm-animal-icon-set-vector-id165966103?s=170x170",
            "unit_cost": 15.0
        },
        {
            "asset_family": "Editorial",
            "asset_id": "172774834",
            "asset_type": "Image",
            "billing_country_code": "GBR",
            "collection_code": "ISI",
            "collection_info": {
                "id": 0,
                "name": "Signature"
            },
            "cost": "15 credits",
            "customer_id": 3009160,
            "download_agreement_id": 0,
            "download_by": "Alejandro Vargas",
            "download_detail_id": 2172428,
            "download_id": 774923094,
            "download_product_type": "credits",
            "duplicate_count": 31,
            "i_stock_licenses": [
                "standard"
            ],
            "image_caption": "Lizard with hedgehog and llamas",
            "is_audio": false,
            "is_cancelable": false,
            "is_canceled": false,
            "is_pulled": false,
            "istock_collection": "essentials_collection",
            "landing_url": "/vector/lizard-playing-gm165966103-20822232?clarity=false",
            "license_type": "RF",
            "media_type": "illustration",
            "order_id": 0,
            "show_actions": false,
            "site_id": 441,
            "thumb_url": "https://media.somesvr-istockphoto.com/vectors/llama-id156666103?s=170x170",
            "unit_cost": 35.0
        }
    ],
    "total_count": 3
})

const shortPause = () => 1400

// To support a compositional/declarative
// programming style:
const compose = (...args) =>
  arg =>
    args.reduce(
      (composed, f) => f(composed),
      arg
    )

const displayRecord = dlHistRecord =>
  console.log(dlHistRecord)

const clearConsole = () => console.clear()

const numHistoryItems = () =>
  dlHistory().total_count

const rotate = count => {
  if (count > dlHistory().total_count || count < 0) {
    throw "invalid rotation count"
  }
  return new Date().getSeconds() % count
}

const rotateDownloadHistoryRecord = count => () =>
  dlHistory().items[rotate(count)]

const format = templateString => downloadRecord =>
  templateString.replace("[asset-id]", downloadRecord.asset_id)
    .replace("[download-id]", downloadRecord.download_id)
    .replace("[pulled]", downloadRecord.is_pulled ? "** Asset has been pulled **" : "")
    .replace("[downloaded-by]", downloadRecord.download_by)
    .replace("[caption]", downloadRecord.image_caption)
    .replace("[duplicate-count]", downloadRecord.duplicate_count)

const upperCase = key => downloadRecord =>({
  ...downloadRecord,
  [key]: downloadRecord[key].toUpperCase()
})

const incrementDupCount = downloadRecord => {
  let assetId = downloadRecord.asset_id
  let origDupCount = downloadRecord.duplicate_count
  const shouldIncrement = (id) => id === '701659966'

  return {
  ...downloadRecord,
  duplicate_count: shouldIncrement(assetId) ?
    `${origDupCount + 1} (was ${origDupCount})` :
    downloadRecord.duplicate_count
  }
}

const makeLoud = downloadRecord =>
  compose(
    upperCase("download_by"),
    upperCase("image_caption"),
  )(downloadRecord)


const historyTemplate = () => `
                   [caption]

        asset ID is [asset-id]
        download ID is [download-id]
        user who downloaded it: [downloaded-by]
        duplicate count: [duplicate-count]

                   [pulled]`

const run = () =>
  setInterval(
    compose(
      clearConsole,
      rotateDownloadHistoryRecord(3),
      incrementDupCount,
      format(historyTemplate()),
      displayRecord,
    ),
    shortPause()
  )

run()

