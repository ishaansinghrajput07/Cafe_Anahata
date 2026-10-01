import { useEffect, useState } from 'react'
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays,
  Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Coffee, Download, Leaf, MapPin,
  Menu as MenuIcon, Minus, Plus, Search, ShoppingBag, Sparkles,
  UtensilsCrossed, X,
} from 'lucide-react'
import anahataHero from './assets/anahata-mountain-view.jpg'
import anahataVenue from './assets/anahata-venue-wide.jpg'
import anahataTerrace from './assets/anahata-terrace.jpg'
import anahataFood from './assets/anahata-table.jpg'
import anahataSoup from './assets/anahata-event.jpg'
import anahataSunset from './assets/anahata-sunset.jpg'
import anahataEvening from './assets/anahata-evening.jpg'
import anahataCafeEvening from './assets/anahata-cafe-night.jpg'
import anahataCafeTable from './assets/anahata-cafe-table.jpg'
import './App.css'

const STORAGE = {
  reservations: 'cafe-anahata-reservations',
  inquiries: 'cafe-anahata-inquiries',
  orders: 'cafe-anahata-orders',
}

const LEGACY_STORAGE = {
  reservations: 'sunday-cafe-reservations',
  inquiries: 'sunday-cafe-inquiries',
  orders: 'sunday-cafe-orders',
}

const dateOffset = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const seedRecords = {
  reservations: [
    { id: 'BK-2048', name: 'Maya Kapoor', email: 'maya.k@email.com', phone: '+91 98765 43210', date: dateOffset(1), time: '10:30', guests: '3', occasion: 'Birthday brunch', status: 'Confirmed', createdAt: dateOffset(0) },
    { id: 'BK-2047', name: 'Arjun Mehta', email: 'arjun.m@email.com', phone: '+91 98123 45678', date: dateOffset(2), time: '19:00', guests: '2', occasion: 'Date night', status: 'Pending', createdAt: dateOffset(0) },
    { id: 'BK-2046', name: 'Nisha Roy', email: 'nisha.roy@email.com', phone: '+91 99001 22334', date: dateOffset(3), time: '13:00', guests: '6', occasion: 'Family lunch', status: 'Confirmed', createdAt: dateOffset(-1) },
  ],
  inquiries: [
    { id: 'EN-781', name: 'Rhea Sen', email: 'rhea.s@email.com', phone: '+91 98877 66554', subject: 'Private celebration', message: 'Looking for a cozy corner for a small anniversary dinner.', status: 'New', createdAt: dateOffset(0) },
    { id: 'EN-780', name: 'Kabir Das', email: 'kabir.d@email.com', phone: '+91 97766 55443', subject: 'Dietary question', message: 'Do you have vegan options for brunch?', status: 'In progress', createdAt: dateOffset(-1) },
  ],
  orders: [
    { id: 'OR-392', name: 'Ishita Bose', email: 'ishita.b@email.com', phone: '+91 96655 44332', items: '2 x Iced oat latte, 1 x Pistachio croissant', total: 590, status: 'Preparing', createdAt: dateOffset(0) },
    { id: 'OR-391', name: 'Dev Malhotra', email: 'dev.m@email.com', phone: '+91 95544 33221', items: '1 x Veg Thukpa, 1 x Fruit Beer', total: 380, status: 'Ready', createdAt: dateOffset(-1) },
  ],
}

function readRecords(key) {
  try {
    const stored = localStorage.getItem(STORAGE[key])
    if (stored) return JSON.parse(stored)
    const legacyStored = localStorage.getItem(LEGACY_STORAGE[key])
    if (legacyStored) {
      localStorage.setItem(STORAGE[key], legacyStored)
      return JSON.parse(legacyStored)
    }
    localStorage.setItem(STORAGE[key], JSON.stringify(seedRecords[key]))
  } catch {
    return seedRecords[key]
  }
  return seedRecords[key]
}

const makeId = (prefix) => `${prefix}-${Date.now().toString().slice(-6)}`
const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

const menuItems = [
  { name: 'Veg Thukpa', note: 'A warming bowl for mountain weather', price: 210, category: 'Tibetan', image: anahataSoup, tag: 'Local favourite' },
  { name: 'Tingmo steamed bread', note: 'Soft, pillowy bread made for sharing', price: 60, category: 'Tibetan', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82' },
  { name: 'Chicken Datshi', note: 'A rich, comforting Himalayan classic', price: 380, category: 'Tibetan', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=82' },
  { name: 'Steamed momos', note: 'Folded by hand and served piping hot', price: 240, category: 'Tibetan', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=82' },
  { name: 'Veg chow mein', note: 'Wok-tossed noodles with crisp vegetables', price: 260, category: 'Tibetan', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=82' },
  { name: 'Anahata Special Sandwich', note: 'A house-made cafe classic', price: 310, category: 'Cafe classics', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=82', tag: 'House favourite' },
  { name: 'Peri Peri Chicken Cheese Sandwich', note: 'Grilled, cheesy, with a little kick', price: 330, category: 'Cafe classics', image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=900&q=82' },
  { name: 'Cafe chicken steak', note: 'Grilled chicken with a bright herb finish', price: 420, category: 'Cafe classics', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=82' },
  { name: 'Anahata garden pizza', note: 'A crisp, cheesy cafe favourite', price: 390, category: 'Cafe classics', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=82' },
  { name: 'Classic cafe burger', note: 'A hearty stack with golden fries', price: 360, category: 'Cafe classics', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=82' },
  { name: 'Blueberry Cheesecake', note: 'A little something sweet after lunch', price: 280, category: 'Sweet things', image: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?auto=format&fit=crop&w=900&q=82' },
  { name: 'Mango Cheesecake', note: 'Fresh, creamy, made for slow afternoons', price: 280, category: 'Sweet things', image: anahataTerrace },
  { name: 'Chocolate truffle cake', note: 'Deep cocoa layers and a soft crumb', price: 290, category: 'Sweet things', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=82' },
  { name: 'Berry cream cup', note: 'Seasonal berries with a cool, creamy finish', price: 260, category: 'Sweet things', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=82' },
  { name: 'Brownie bites', note: 'Fudgy, chocolatey, made for sharing', price: 220, category: 'Sweet things', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=82' },
  { name: 'Virgin Mojito', note: 'Mint, citrus, and mountain air', price: 200, category: 'Drinks', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=82' },
  { name: 'Fruit Beer', note: 'A bright, easy-going cooler', price: 170, category: 'Drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=82' },
  { name: 'Cappuccino', note: 'Espresso with a smooth, velvety crown', price: 190, category: 'Drinks', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=82' },
  { name: 'Iced coffee', note: 'Chilled coffee for a sunny afternoon', price: 220, category: 'Drinks', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=82' },
  { name: 'Masala chai', note: 'A warming cup for cool mountain air', price: 100, category: 'Drinks', image: 'https://images.unsplash.com/photo-1543255006-d6395b6f1171?auto=format&fit=crop&w=900&q=82' },
]

const categories = ['All day', 'Tibetan', 'Cafe classics', 'Sweet things', 'Drinks']

const eventPosterSlides = [
  { image: anahataHero, alt: 'Cafe Anahata above the Mussoorie valley', eyebrow: 'CELEBRATE ABOVE THE VALLEY', title: 'Host with', accent: 'Anahata.', copy: 'Gather your people, find your table, and make a day of the hills.' },
  { image: anahataTerrace, alt: 'Cafe Anahata terrace overlooking the mountains', eyebrow: 'A TABLE WITH A VIEW', title: 'Make room for', accent: 'the moment.', copy: 'A birthday lunch, a long family meal, or an evening worth remembering.' },
  { image: anahataVenue, alt: 'Cafe Anahata dining room and mountain-side terrace', eyebrow: 'YOUR PEOPLE · OUR PLACE', title: 'Bring everyone', accent: 'to the hills.', copy: 'A high-ceiling cafe, warm tables, and a mountain view for your gathering.' },
  { image: anahataFood, alt: 'Cafe Anahata Tibetan dishes and momos set across a table', eyebrow: 'GOOD FOOD · GOOD COMPANY', title: 'Pass around', accent: 'something lovely.', copy: 'Tibetan favourites and cafe classics for a gathering in the mountains.' },
  { image: anahataSunset, alt: 'Cafe Anahata terrace in the evening light', eyebrow: 'WHEN THE HILLS TURN GOLD', title: 'Stay for', accent: 'the evening.', copy: 'A sunset table, something delicious, and nowhere else you need to be.' },
  { image: anahataSoup, alt: 'A bowl of thukpa from Cafe Anahata', eyebrow: 'A LITTLE COMFORT FOR THE TABLE', title: 'Good food', accent: 'brings us close.', copy: 'Share a warming bowl and settle into the easy pace of Happy Valley.' },
]

function App() {
  const isAdmin = window.location.pathname.startsWith('/admin')
  const [reservations, setReservations] = useState(() => readRecords('reservations'))
  const [inquiries, setInquiries] = useState(() => readRecords('inquiries'))
  const [orders, setOrders] = useState(() => readRecords('orders'))

  useEffect(() => localStorage.setItem(STORAGE.reservations, JSON.stringify(reservations)), [reservations])
  useEffect(() => localStorage.setItem(STORAGE.inquiries, JSON.stringify(inquiries)), [inquiries])
  useEffect(() => localStorage.setItem(STORAGE.orders, JSON.stringify(orders)), [orders])

  if (isAdmin) {
    return <AdminDashboard reservations={reservations} setReservations={setReservations} inquiries={inquiries} setInquiries={setInquiries} orders={orders} setOrders={setOrders} />
  }

  return <CafeSite setReservations={setReservations} setInquiries={setInquiries} setOrders={setOrders} />
}

function CafeSite({ setReservations, setInquiries, setOrders }) {
  const [activeCategory, setActiveCategory] = useState('All day')
  const [bookingOpen, setBookingOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [cart, setCart] = useState({})
  const [toast, setToast] = useState('')
  const [booked, setBooked] = useState(false)
  const [eventType, setEventType] = useState('Private celebration')
  const [posterIndex, setPosterIndex] = useState(0)
  const visibleItems = activeCategory === 'All day' ? menuItems : menuItems.filter((item) => item.category === activeCategory)
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  const cartTotal = menuItems.reduce((total, item) => total + item.price * (cart[item.name] || 0), 0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const interval = window.setInterval(() => {
      setPosterIndex((current) => (current + 1) % eventPosterSlides.length)
    }, 6200)
    return () => window.clearInterval(interval)
  }, [])

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  const addToCart = (item) => setCart((current) => ({ ...current, [item.name]: (current[item.name] || 0) + 1 }))

  const submitBooking = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const record = Object.fromEntries(form.entries())
    setReservations((current) => [{ ...record, id: makeId('BK'), status: 'Pending', createdAt: dateOffset(0) }, ...current])
    setBooked(true)
  }

  const submitInquiry = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const record = Object.fromEntries(form.entries())
    const eventDetails = [
      record.eventType && `Event: ${record.eventType}`,
      record.eventDate && `Preferred date: ${record.eventDate}`,
      record.guestCount && `Guests: ${record.guestCount}`,
      record.message,
    ].filter(Boolean)
    if (record.eventType) record.message = eventDetails.join(' | ')
    delete record.eventType
    delete record.eventDate
    delete record.guestCount
    setInquiries((current) => [{ ...record, id: makeId('EN'), status: 'New', createdAt: dateOffset(0) }, ...current])
    event.currentTarget.reset()
    notify(record.subject === 'Event enquiry' ? 'Your event idea is with our team. We will be in touch soon.' : 'Your note is with our team. We will be in touch soon.')
  }

  const submitOrder = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const customer = Object.fromEntries(form.entries())
    const items = menuItems.filter((item) => cart[item.name]).map((item) => `${cart[item.name]} x ${item.name}`).join(', ')
    setOrders((current) => [{ ...customer, id: makeId('OR'), items, total: cartTotal, status: 'Received', createdAt: dateOffset(0) }, ...current])
    setCart({})
    setCartOpen(false)
    notify('Order received. We are getting it ready.')
  }

  return (
    <div className="cafe-site">
      <div className="announcement"><Sparkles size={14} /> A little mountain air is good for the soul.</div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Cafe Anahata, home"><span className="wordmark-icon"><Coffee size={19} /></span><span>anahata<span className="wordmark-dot">.</span><small>CAFE · MUSSOORIE</small></span></a>
        <button className="icon-button mobile-menu-toggle" aria-label="Toggle navigation" onClick={() => setMobileNavOpen(!mobileNavOpen)}>{mobileNavOpen ? <X /> : <MenuIcon />}</button>
        <nav className={mobileNavOpen ? 'main-nav is-open' : 'main-nav'}>
          <a href="#story" onClick={() => setMobileNavOpen(false)}>About</a><a href="#menu" onClick={() => setMobileNavOpen(false)}>Menu</a><a href="#events" onClick={() => setMobileNavOpen(false)}>Events</a><a href="#order-now" onClick={() => setMobileNavOpen(false)}>Order now</a>
          <button className="button button-dark nav-book" onClick={() => { setBooked(false); setBookingOpen(true); setMobileNavOpen(false) }}><CalendarDays size={16} /> Book a table</button>
        </nav>
        <button className="bag-button" aria-label={`Open bag, ${cartCount} items`} onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span>Order ahead</span><b>{cartCount}</b></button>
      </header>

      <main>
        <section className="hero-section" id="top">
          <div className="hero-image-layer"><img src={anahataHero} alt="Cafe Anahata above the Mussoorie valley" /><div className="hero-image-shade" /></div>
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> HAPPY VALLEY · MUSSOORIE</p>
            <h1>Find your<br /><em>mountain</em><br />moment.</h1>
            <p className="hero-description">Tibetan comfort food, cafe favourites, and a terrace table with the hills for company.</p>
            <div className="hero-actions"><a className="button button-light" href="#menu">Explore the menu <ArrowRight size={16} /></a><button className="hero-book-link" onClick={() => { setBooked(false); setBookingOpen(true) }}>Reserve a table <ArrowUpRight size={15} /></button></div>
            <div className="hero-note"><span className="note-stars">★★★★★</span><span>4.8 / 5 <small>from 1,495 Google reviews</small></span></div>
          </div>
          <div className="hero-location"><MapPin size={15} /><span>Opposite Buddha Temple<small>Happy Valley · Mussoorie</small></span></div>
          <a className="hero-scroll" href="#menu"><span>SCROLL TO DISCOVER</span><ArrowDownRight size={15} /></a>
          <div className="hero-hours"><Clock3 size={14} /> EVERY DAY · 10 AM — 9:30 PM</div>
        </section>

        <div className="detail-strip"><span><Clock3 size={15} /> DAILY, 10 AM — 9:30 PM</span><span><MapPin size={15} /> OPP. BUDDHA TEMPLE, HAPPY VALLEY</span><span className="strip-highlight">Mountain-view terrace <span>↗</span></span></div>

        <section className="menu-section section-wrap" id="menu">
          <div className="section-heading"><div><p className="eyebrow">TIBETAN · CHINESE · CAFE CLASSICS</p><h2>Good things from<br /><em>the mountains.</em></h2></div><a className="text-link menu-full-link" href="#menu-grid">View the menu <ArrowRight size={15} /></a></div>
          <div className="menu-toolbar"><div className="category-tabs" role="tablist" aria-label="Menu categories">{categories.map((category) => <button key={category} className={activeCategory === category ? 'category-tab active' : 'category-tab'} role="tab" aria-selected={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><span className="menu-note">Seasonal, local, always made fresh</span></div>
          <div className="menu-grid" id="menu-grid">{visibleItems.map((item, index) => <article className="menu-card" key={item.name} style={{ '--card-index': index }}>
            <div className="menu-image"><img src={item.image} alt={item.name} loading="lazy" />{item.tag && <span className="menu-tag">{item.tag}</span>}<button className="add-button" aria-label={`Add ${item.name} to order`} onClick={() => addToCart(item)}><Plus size={18} /></button></div>
            <div className="menu-card-copy"><div><h3>{item.name}</h3><p>{item.note}</p></div></div>
          </article>)}</div>
          <p className="menu-footnote"><span><Leaf size={15} /> Made for slow lunches and long views.</span><button onClick={() => setCartOpen(true)}>Order for pickup <ArrowRight size={15} /></button></p>
        </section>

        <section className="offering-section section-wrap">
          <div className="offering-heading"><p className="eyebrow">A FEW REASONS TO STAY A WHILE</p><h2>Made for <em>mountain hours.</em></h2></div>
          <div className="offering-grid">
            <article><span className="offering-number">01</span><h3>Himalayan comfort</h3><p>Thukpa, momos, and Tibetan favourites for cool days in the hills.</p></article>
            <article><span className="offering-number">02</span><h3>Cafe classics</h3><p>Sandwiches, familiar plates, and something easy to share.</p></article>
            <article><span className="offering-number">03</span><h3>A sweet pause</h3><p>Cheesecake and a warm drink make the view last a little longer.</p></article>
            <article><span className="offering-number">04</span><h3>Terrace time</h3><p>Settle in across from the Buddha Temple, with the valley all around.</p></article>
          </div>
        </section>

        <section className="story-section" id="story">
          <div className="story-photo"><img src={anahataFood} alt="A spread of Cafe Anahata momos and Tibetan dishes" loading="lazy" /><span className="photo-stamp">HAPPY<br />VALLEY</span></div>
          <div className="story-copy"><p className="eyebrow">A CAFE ABOVE THE EVERYDAY</p><h2>Good food.<br />Fresh air.<br /><em>Room to linger.</em></h2><p>Across from the Buddha Temple in Happy Valley, Cafe Anahata brings Tibetan comfort food, Chinese and cafe favourites together with the calm of the hills. Come for thukpa or momos; stay for the view, a slice of cheesecake, and one more cup of tea.</p><a className="button button-outline" href="#visit">Plan your visit <ArrowRight size={16} /></a><div className="story-signature">Find your mountain moment <span>— Cafe Anahata</span></div></div>
        </section>

        <section className="gallery-section section-wrap"><div className="gallery-heading"><div><p className="eyebrow">A WINDOW INTO ANAHATA</p><h2>Take in the <em>view.</em></h2></div><a className="text-link" href="https://www.instagram.com/cafeanahata/" target="_blank" rel="noreferrer">More from the cafe <ArrowUpRight size={15} /></a></div><div className="gallery-grid"><figure className="gallery-card gallery-wide"><img src={anahataCafeEvening} alt="A guest sharing an evening meal at Cafe Anahata" loading="lazy" /><figcaption>Above the valley, into the evening.</figcaption></figure><figure className="gallery-card"><img src={anahataEvening} alt="Warmly lit Cafe Anahata dining room" loading="lazy" /><figcaption>Come in and settle down.</figcaption></figure><figure className="gallery-card"><img src={anahataCafeTable} alt="Cafe Anahata exterior with its mountain-side roof and terrace" loading="lazy" /><figcaption>A window seat in the hills.</figcaption></figure></div></section>

        <section className="review-band"><div className="review-score"><strong>4.8</strong><span>★★★★★</span><small>1,495 Google reviews</small></div><div className="review-copy"><p className="eyebrow">KIND WORDS FROM THE HILLS</p><h2>A table with a view,<br /><em>and a warm welcome.</em></h2><p>Guests mention the Tibetan favourites, peaceful setting, and attentive service.</p></div><a className="button button-outline" href="https://www.google.com/maps/search/?api=1&query=Cafe+Anahata+Happy+Valley+Mussoorie" target="_blank" rel="noreferrer">Read guest reviews <ArrowUpRight size={15} /></a></section>

        <section className="stay-band stay-text-band"><div className="stay-copy"><p className="eyebrow">MAKE A DAY OF THE HILLS</p><h2>Stay a little <em>longer.</em></h2><p>Turning your cafe visit into a Mussoorie getaway? Explore places to stay around Happy Valley and plan an easy walk back for breakfast or tea.</p><a className="button button-outline" href="https://www.google.com/maps/search/stays+near+Cafe+Anahata+Happy+Valley+Mussoorie" target="_blank" rel="noreferrer">Explore nearby stays <ArrowUpRight size={15} /></a></div><div className="stay-location-mark"><MapPin size={22} /><span>HAPPY VALLEY<small>MUSSOORIE · UTTARAKHAND</small></span></div></section>

        <section className="event-band" id="events">
          <div className="event-poster-images" aria-hidden="true">{eventPosterSlides.map((slide, index) => <img key={slide.image} className={index === posterIndex ? 'event-poster-image is-active' : 'event-poster-image'} src={slide.image} alt="" />)}</div>
          <div className="event-poster-shade" />
          <div className="event-mark"><UtensilsCrossed size={22} /></div>
          <div className="event-copy" aria-live="polite"><p className="eyebrow">{eventPosterSlides[posterIndex].eyebrow}</p><h2>{eventPosterSlides[posterIndex].title}<br /><em>{eventPosterSlides[posterIndex].accent}</em></h2><p>{eventPosterSlides[posterIndex].copy}</p><div className="event-tags"><span>Private gatherings</span><span>Creative meetups</span><span>Special evenings</span></div></div>
          <button className="button event-poster-cta" onClick={() => document.querySelector('#event-enquiry')?.scrollIntoView({ behavior: 'smooth' })}>Plan your gathering <ArrowRight size={16} /></button>
          <div className="poster-controls" aria-label="Event poster slides"><button type="button" className="poster-arrow" aria-label="Previous event slide" onClick={() => setPosterIndex((current) => (current - 1 + eventPosterSlides.length) % eventPosterSlides.length)}><ChevronLeft size={18} /></button><div className="poster-dots">{eventPosterSlides.map((slide, index) => <button key={slide.image} type="button" className={index === posterIndex ? 'poster-dot active' : 'poster-dot'} aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`} aria-pressed={index === posterIndex} onClick={() => setPosterIndex(index)} />)}</div><button type="button" className="poster-arrow" aria-label="Next event slide" onClick={() => setPosterIndex((current) => (current + 1) % eventPosterSlides.length)}><ChevronRight size={18} /></button></div>
          <span className="event-scribble">make a day<br />of it <ArrowDownRight size={19} /></span>
        </section>

        <section className="host-section section-wrap">
          <div className="host-heading"><p className="eyebrow">HOST WITH ANAHATA</p><h2>Bring your people <em>to the hills.</em></h2><p>Tell us what you have in mind. We will check the space and date with you.</p></div>
          <div className="host-grid">
            {[
              { type: 'Private celebration', title: 'Private gatherings', copy: 'Birthdays, reunions, and a table full of your favourite people.', icon: CalendarDays },
              { type: 'Live music or performance', title: 'Evenings together', copy: 'Ask us about hosting a performance or a special evening.', icon: Coffee },
              { type: 'Workshop or creative session', title: 'Creative meetups', copy: 'Thinking of a workshop or a small community get-together?', icon: Sparkles },
            ].map((event) => <article className="host-card" key={event.type}><span className="host-icon"><event.icon size={19} /></span><div className="host-card-copy"><h3>{event.title}</h3><p>{event.copy}</p><button type="button" className="text-link" onClick={() => { setEventType(event.type); document.querySelector('#event-enquiry')?.scrollIntoView({ behavior: 'smooth' }) }}>Plan this with us <ArrowRight size={15} /></button></div></article>)}
          </div>
          <form id="event-enquiry" className="event-enquiry" onSubmit={submitInquiry}><div className="event-form-heading"><p className="eyebrow">TELL US YOUR IDEA</p><h3>Let’s find a date.</h3><p>Event requests are confirmed by our team based on availability.</p></div><input type="hidden" name="subject" value="Event enquiry" /><div className="event-form-fields"><label>Event type<select name="eventType" value={eventType} onChange={(event) => setEventType(event.target.value)}><option>Private celebration</option><option>Live music or performance</option><option>Workshop or creative session</option><option>Group meal</option></select></label><label>Your name<input name="name" required placeholder="Your name" /></label><label>Email<input name="email" type="email" required placeholder="you@example.com" /></label><label>Phone<input name="phone" type="tel" required placeholder="+91" /></label><label>Preferred date<input name="eventDate" type="date" min={dateOffset(0)} /></label><label>Guests<select name="guestCount" defaultValue=""><option value="" disabled>Choose a group size</option><option>1–4</option><option>5–10</option><option>11–20</option><option>21+</option></select></label><label className="event-message-field">A few details<textarea name="message" rows="3" placeholder="Tell us a little about what you are planning..." /></label><button className="button button-dark" type="submit">Send event enquiry <ArrowRight size={16} /></button></div></form>
        </section>

        <section className="order-choice-section section-wrap" id="order-now"><div className="order-choice-heading"><p className="eyebrow">HOW WOULD YOU LIKE TO ENJOY ANAHATA?</p><h2>Come in, or <em>take it along.</em></h2></div><div className="order-choice-grid"><article className="order-choice-card dine-in-card"><img className="order-choice-image" src={anahataTerrace} alt="Desserts waiting on Cafe Anahata's mountain-view terrace" loading="lazy" /><div className="order-choice-copy"><p className="eyebrow">SECTION 01 · DINE IN</p><h3>Come to the hills.</h3><p>Choose your date and join us across from the Buddha Temple.</p><button className="text-link" onClick={() => { setBooked(false); setBookingOpen(true) }}>Reserve your table <ArrowRight size={15} /></button></div></article><article className="order-choice-card pickup-card"><img className="order-choice-image" src={anahataSoup} alt="A bowl of thukpa from Cafe Anahata" loading="lazy" /><div className="order-choice-copy"><p className="eyebrow">SECTION 02 · PICKUP</p><h3>Take a little Anahata along.</h3><p>Build a pickup order from the menu, or call us to ask about delivery.</p><button className="text-link" onClick={() => setCartOpen(true)}>Start a pickup order <ArrowRight size={15} /></button><a className="delivery-link" href="tel:+919762326369">Check delivery availability <ArrowUpRight size={14} /></a></div></article></div></section>

        <section className="visit-section section-wrap" id="visit">
          <div className="visit-copy"><p className="eyebrow">COME FIND US IN HAPPY VALLEY</p><h2>Opposite the<br /><em>Buddha Temple.</em></h2><p>Take the turn toward Charleville and follow the mountain air. You will find us just across from the temple.</p><div className="visit-details"><div><MapPin size={17} /><span><b>Opp. Buddhist Temple, Happy Valley</b><small>Charleville, Mussoorie, Uttarakhand 248179</small></span></div><div><Clock3 size={17} /><span><b>Daily, 10 am – 9:30 pm</b><small>Come by for lunch, tea, or the evening view</small></span></div><div><Coffee size={17} /><span><b>Call +91 97623 26369</b><small>Ask about tables and today's specials</small></span></div></div><div className="visit-actions"><a className="text-link" href="https://maps.google.com/?q=Cafe+Anahata+near+Buddhist+temple+Happy+Valley+Mussoorie" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={15} /></a><a className="text-link" href="https://wa.me/919762326369?text=Hello%20Cafe%20Anahata%2C%20what%20are%20today%E2%80%99s%20specials%3F" target="_blank" rel="noreferrer">Ask on WhatsApp <ArrowUpRight size={15} /></a></div></div>
          <div className="contact-form-wrap"><p className="eyebrow">A NOTE TO OUR TEAM</p><h3>We are all ears.</h3><p>Questions, kind words, or a plan for something lovely? Send us a note.</p><form className="contact-form" onSubmit={submitInquiry}><div className="form-row"><label>Your name<input name="name" required placeholder="How should we call you?" /></label><label>Email address<input type="email" name="email" required placeholder="you@example.com" /></label></div><label>What is on your mind?<textarea name="message" required rows="3" placeholder="Tell us a little about it..." /></label><input type="hidden" name="subject" value="Website enquiry" /><button className="button button-dark" type="submit">Send your note <ArrowRight size={16} /></button></form></div>
        </section>
      </main>

      <footer className="site-footer"><a className="wordmark footer-mark" href="#top"><span className="wordmark-icon"><Coffee size={19} /></span><span>anahata<span className="wordmark-dot">.</span><small>CAFE · MUSSOORIE</small></span></a><p>Tibetan comfort food, cafe favourites, and a view worth staying for.</p><div className="footer-links"><a href="#menu">Menu</a><a href="#story">Our place</a><a href="https://www.instagram.com/cafeanahata/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={13} /></a><a href="/admin">Team desk <ArrowUpRight size={13} /></a></div><small className="copyright">© 2026 Cafe Anahata · Happy Valley, Mussoorie</small></footer>

      {bookingOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false) }}><section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title"><button className="modal-close icon-button" aria-label="Close booking" onClick={() => setBookingOpen(false)}><X /></button>{booked ? <div className="booking-success"><span className="success-mark"><Check /></span><p className="eyebrow">YOU ARE ON OUR LIST</p><h2 id="booking-title">A seat is<br /><em>almost yours.</em></h2><p>We have your request. Our team will reach out shortly to confirm the details.</p><button className="button button-dark" onClick={() => setBookingOpen(false)}>Lovely, thanks <ArrowRight size={16} /></button></div> : <><p className="eyebrow">LET'S MAKE A LITTLE ROOM</p><h2 id="booking-title">Save your<br /><em>seat at the table.</em></h2><p>For today, give us a call. For another day, leave us a note.</p><form className="booking-form" onSubmit={submitBooking}><label>Your name<input name="name" required placeholder="Your name" /></label><div className="form-row"><label>Email<input type="email" name="email" required placeholder="you@example.com" /></label><label>Phone<input type="tel" name="phone" required placeholder="+91" /></label></div><div className="form-row"><label>Date<input type="date" name="date" min={dateOffset(1)} required /></label><label>Time<select name="time" required defaultValue=""><option value="" disabled>Choose a time</option><option>10:00</option><option>11:30</option><option>13:00</option><option>15:00</option><option>17:00</option><option>19:00</option><option>20:30</option></select></label></div><div className="form-row"><label>Guests<select name="guests" defaultValue="2"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7+</option></select></label><label>Occasion<input name="occasion" placeholder="Birthday, just because..." /></label></div><button className="button button-dark booking-submit" type="submit">Request a table <ArrowRight size={16} /></button></form><a className="modal-call" href="tel:+919762326369">Need a table today? Call +91 97623 26369</a></>}</section></div>}

      {cartOpen && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-drawer" aria-label="Your order"><div className="drawer-heading"><div><p className="eyebrow">MADE FRESH, JUST FOR YOU</p><h2>Your little order</h2></div><button className="icon-button" aria-label="Close order" onClick={() => setCartOpen(false)}><X /></button></div>{cartCount === 0 ? <div className="empty-cart"><span className="empty-cart-icon"><ShoppingBag /></span><h3>Nothing in the bag yet.</h3><p>Pick a little something from the menu. We will have it ready for you.</p><button className="button button-dark" onClick={() => { setCartOpen(false); document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' }) }}>Browse the menu <ArrowRight size={15} /></button></div> : <><div className="cart-lines">{menuItems.filter((item) => cart[item.name]).map((item) => <div className="cart-line" key={item.name}><img src={item.image} alt="" /><div className="cart-item-info"><b>{item.name}</b><span>{money(item.price)}</span><div className="quantity-control"><button aria-label={`Remove one ${item.name}`} onClick={() => setCart((current) => ({ ...current, [item.name]: Math.max(0, current[item.name] - 1) }))}><Minus size={13} /></button><span>{cart[item.name]}</span><button aria-label={`Add one ${item.name}`} onClick={() => addToCart(item)}><Plus size={13} /></button></div></div><strong>{money(item.price * cart[item.name])}</strong></div>)}</div><form className="checkout-form" onSubmit={submitOrder}><h3>Who is picking this up?</h3><label>Your name<input name="name" required placeholder="Your name" /></label><label>Phone<input name="phone" type="tel" required placeholder="+91" /></label><input type="hidden" name="email" value="pickup order" /><div className="order-total"><span>Subtotal</span><b>{money(cartTotal)}</b></div><button className="button button-dark checkout-button" type="submit">Place pickup order <ArrowRight size={16} /></button></form></>}</aside></div>}
      {toast && <div className="toast-message" role="status"><Check size={17} />{toast}</div>}
    </div>
  )
}

function AdminDashboard({ reservations, setReservations, inquiries, setInquiries, orders, setOrders }) {
  const [activeTab, setActiveTab] = useState('Reservations')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [exporting, setExporting] = useState(false)
  const [todayLabel] = useState(() => new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }))
  const dataMap = { Reservations: reservations, Enquiries: inquiries, Orders: orders }
  const setterMap = { Reservations: setReservations, Enquiries: setInquiries, Orders: setOrders }
  const records = dataMap[activeTab]
  const statuses = activeTab === 'Reservations' ? ['Pending', 'Confirmed', 'Cancelled'] : activeTab === 'Enquiries' ? ['New', 'In progress', 'Resolved'] : ['Received', 'Preparing', 'Ready', 'Completed']
  const filteredRecords = records.filter((record) => {
    const queryMatches = Object.values(record).join(' ').toLowerCase().includes(search.toLowerCase())
    return queryMatches && (statusFilter === 'All statuses' || record.status === statusFilter)
  })
  const newCount = inquiries.filter((item) => item.status === 'New').length + reservations.filter((item) => item.status === 'Pending').length

  const updateStatus = (id, status) => setterMap[activeTab]((current) => current.map((record) => record.id === id ? { ...record, status } : record))

  const exportExcel = async () => {
    setExporting(true)
    try {
      const { default: ExcelJS } = await import('exceljs')
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'Cafe Anahata'
      const worksheet = workbook.addWorksheet(activeTab)
      const headers = activeTab === 'Reservations'
        ? ['Reference', 'Guest', 'Email', 'Phone', 'Date', 'Time', 'Guests', 'Occasion', 'Status', 'Received']
        : activeTab === 'Enquiries'
          ? ['Reference', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Received']
          : ['Reference', 'Customer', 'Email', 'Phone', 'Items', 'Total (INR)', 'Status', 'Received']
      worksheet.columns = headers.map((header) => ({ header, key: header, width: Math.max(14, header.length + 4) }))
      worksheet.addRows(filteredRecords.map((record) => activeTab === 'Reservations'
        ? [record.id, record.name, record.email, record.phone, record.date, record.time, record.guests, record.occasion, record.status, record.createdAt]
        : activeTab === 'Enquiries'
          ? [record.id, record.name, record.email, record.phone, record.subject, record.message, record.status, record.createdAt]
          : [record.id, record.name, record.email, record.phone, record.items, record.total, record.status, record.createdAt]))
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF26382D' } }
      worksheet.views = [{ state: 'frozen', ySplit: 1 }]
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `cafe-anahata-${activeTab.toLowerCase()}-${dateOffset(0)}.xlsx`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return <div className="admin-app"><aside className="admin-sidebar"><a className="wordmark admin-wordmark" href="/"><span className="wordmark-icon"><Coffee size={19} /></span><span>anahata<span className="wordmark-dot">.</span><small>CAFE · MUSSOORIE</small></span></a><div className="admin-side-label">WORKSPACE</div><nav className="admin-nav">{[{ name: 'Reservations', icon: CalendarDays }, { name: 'Enquiries', icon: Search }, { name: 'Orders', icon: ShoppingBag }].map(({ name, icon: Icon }) => <button key={name} className={activeTab === name ? 'admin-nav-item active' : 'admin-nav-item'} onClick={() => { setActiveTab(name); setStatusFilter('All statuses'); setSearch('') }}><Icon size={17} /><span>{name}</span>{name === 'Enquiries' && newCount > 0 && <b className="nav-count">{inquiries.filter((item) => item.status === 'New').length}</b>}</button>)}</nav><div className="admin-sidebar-bottom"><div className="team-avatar">A</div><span><b>Anahata team</b><small>Store manager</small></span><ChevronDown size={15} /></div></aside>
    <main className="admin-main"><header className="admin-topbar"><a className="admin-back-link" href="/" aria-label="Back to cafe website"><ArrowLeft size={17} /><span>View website</span></a><div className="admin-top-actions"><span className="open-indicator"><i /> Open today</span><span className="admin-date">{todayLabel}</span><div className="team-avatar small">A</div></div></header>
      <div className="admin-content"><div className="admin-page-heading"><div><p className="eyebrow">YOUR LITTLE CORNER OF THE INTERNET</p><h1>Good morning, team<span>.</span></h1><p>Here is what is happening at the cafe today.</p></div><a href="/#visit" className="admin-help-link">Need a hand? <ArrowUpRight size={14} /></a></div>
        <div className="stat-grid"><article className="stat-card"><span className="stat-icon green"><CalendarDays size={18} /></span><span className="stat-label">UPCOMING TABLES</span><b>{reservations.filter((item) => item.status !== 'Cancelled').length}</b><small>across the next few days</small></article><article className="stat-card"><span className="stat-icon yellow"><Search size={18} /></span><span className="stat-label">NEEDS A REPLY</span><b>{newCount}</b><small>bookings and new enquiries</small></article><article className="stat-card"><span className="stat-icon coral"><ShoppingBag size={18} /></span><span className="stat-label">PICKUP ORDERS</span><b>{orders.filter((item) => item.status !== 'Completed').length}</b><small>still in the kitchen queue</small></article><article className="stat-card revenue-card"><span className="stat-icon blue"><Coffee size={18} /></span><span className="stat-label">ORDERS IN QUEUE</span><b>{money(orders.reduce((total, order) => total + order.total, 0))}</b><small>value of today's pickup orders</small></article></div>

        <section className="records-panel"><div className="records-heading"><div><p className="eyebrow">THE DAILY RHYTHM</p><h2>{activeTab}</h2><p>{activeTab === 'Reservations' ? 'A little hello before everyone arrives.' : activeTab === 'Enquiries' ? 'Notes from people who found their way here.' : 'Fresh from the kitchen, ready for pickup.'}</p></div><button className="button button-dark export-button" onClick={exportExcel} disabled={exporting || filteredRecords.length === 0}><Download size={16} />{exporting ? 'Preparing…' : 'Export Excel'}</button></div>
          <div className="records-toolbar"><div className="admin-tabs">{['Reservations', 'Enquiries', 'Orders'].map((tab) => <button key={tab} className={activeTab === tab ? 'admin-tab active' : 'admin-tab'} onClick={() => { setActiveTab(tab); setStatusFilter('All statuses'); setSearch('') }}>{tab}<span>{dataMap[tab].length}</span></button>)}</div><div className="table-filters"><label className="search-box"><Search size={16} /><input aria-label="Search records" placeholder="Search anything..." value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></label><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div></div>
          <div className="table-scroll"><table className="records-table"><thead><tr>{activeTab === 'Reservations' ? <><th>GUEST</th><th>DATE & TIME</th><th>PARTY</th><th>OCCASION</th><th>STATUS</th><th>REFERENCE</th></> : activeTab === 'Enquiries' ? <><th>FROM</th><th>SUBJECT & NOTE</th><th>RECEIVED</th><th>STATUS</th><th>REFERENCE</th></> : <><th>CUSTOMER</th><th>ORDER</th><th>TOTAL</th><th>RECEIVED</th><th>STATUS</th><th>REFERENCE</th></>}</tr></thead><tbody>{filteredRecords.map((record) => <tr key={record.id}>{activeTab === 'Reservations' ? <><td><div className="guest-cell"><span className="guest-avatar">{record.name?.charAt(0)}</span><span><b>{record.name}</b><small>{record.email}</small></span></div></td><td><b>{record.date}</b><small className="cell-sub">{record.time}</small></td><td>{record.guests} guests</td><td>{record.occasion || '—'}</td><td><StatusSelect value={record.status} statuses={statuses} onChange={(status) => updateStatus(record.id, status)} /></td><td><span className="reference-id">{record.id}</span></td></> : activeTab === 'Enquiries' ? <><td><div className="guest-cell"><span className="guest-avatar">{record.name?.charAt(0)}</span><span><b>{record.name}</b><small>{record.email}</small></span></div></td><td><div className="message-cell"><b>{record.subject}</b><small>{record.message}</small></div></td><td>{record.createdAt}</td><td><StatusSelect value={record.status} statuses={statuses} onChange={(status) => updateStatus(record.id, status)} /></td><td><span className="reference-id">{record.id}</span></td></> : <><td><div className="guest-cell"><span className="guest-avatar">{record.name?.charAt(0)}</span><span><b>{record.name}</b><small>{record.phone}</small></span></div></td><td><div className="message-cell"><b>{record.items}</b></div></td><td><b>{money(record.total)}</b></td><td>{record.createdAt}</td><td><StatusSelect value={record.status} statuses={statuses} onChange={(status) => updateStatus(record.id, status)} /></td><td><span className="reference-id">{record.id}</span></td></>}</tr>)}</tbody></table>{filteredRecords.length === 0 && <div className="empty-table"><span className="empty-table-icon"><Search size={19} /></span><b>No records found</b><p>Try a different search or clear the status filter.</p></div>}</div>
          <div className="table-footer"><span>Showing <b>{filteredRecords.length}</b> of <b>{records.length}</b> {activeTab.toLowerCase()}</span><span>Changes save automatically</span></div>
        </section><div className="admin-footnote"><Leaf size={15} /><span>Take a breath. The mountains are right outside.</span><span className="storage-note">Cafe Anahata · demo data saved on this device</span></div>
      </div>
    </main></div>
}

function StatusSelect({ value, statuses, onChange }) {
  return <label className={`status-pill status-${value.toLowerCase().replaceAll(' ', '-')}`}><span /><select aria-label={`Status: ${value}`} value={value} onChange={(event) => onChange(event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select><ChevronDown size={12} /></label>
}

export default App
