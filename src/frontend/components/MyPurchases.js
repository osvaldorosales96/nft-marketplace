import { useEffect, useState } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap' 

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState('true')
  const [purchases, setPurchases] = useState([])
  const loadPurchasedItems = async () => {
    // fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter = marketplace.filters.Bought(null, null, null, null, null, account)
    const results = await marketplace.queryFilter(filter) 
    // fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(results.map(async i => {
      // get arguments from each results
      i = i.args
      // get uri url from nft contract
      const uri = await nft.tokenURI(i.tokenId)
      // use uri to fetch the nft metadata stored on IPFS
      const response = await fetch(uri)
      const metadata = await response.json()
      // get total price of item (item price + fee)
      const totalPrice = await marketplace.getTotalPrice(i.itemId)
      // define listed item object
      let purchasedItem = {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      }
      return purchasedItem
    }))
    setLoading(false)
    setPurchases(purchases)
  }

  useEffect(() => {
    loadPurchasedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0"}}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className='fles justify-center'>
      {purchases.length > 0 ?
        <div className='px-5 py-3 container'>
          <h2>Purchases</h2>
            <Row xs={1} md={2} lg={4} className="g-4 py-3">
              {purchases.map((item, i) => (
                <Col key={i} className='overflow-hidden'>
                  <Card>
                    <Card.Img variant="top" src={item.image} />
                    <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
        </div>
      : (
          <main style={{ padding: "1rem 0"}}>
            <h2>No Purchases</h2>
          </main>
        
      )}
    </div>
  )
}