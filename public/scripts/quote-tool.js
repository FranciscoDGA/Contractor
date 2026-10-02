(function () {
  var SERVICES = {
    hvac: { label: 'HVAC replacement (furnace + AC)', low: 5000, high: 15000 },
    roof: { label: 'Roof replacement', low: 5500, high: 12000 },
    kitchen: { label: 'Kitchen remodel (mid-range)', low: 25000, high: 60000 },
    bathroom: { label: 'Bathroom remodel (mid-range)', low: 12000, high: 35000 },
    interior_paint: { label: 'Interior painting (whole home)', low: 1000, high: 4000 },
    exterior_paint: { label: 'Exterior painting', low: 1800, high: 7000 },
    deck: { label: 'Deck building', low: 4000, high: 12000 },
    driveway: { label: 'Concrete driveway', low: 2500, high: 8000 },
    flooring: { label: 'Hardwood flooring installation', low: 3000, high: 8000 },
    windows: { label: 'Window replacement (whole home)', low: 4500, high: 10000 },
    drywall: { label: 'Drywall installation / repair', low: 1000, high: 4000 },
    fence: { label: 'Fence installation', low: 2000, high: 6000 }
  };

  var BASE_QUESTIONS = [
    'What is excluded from this quote? (permits, demolition, disposal, painting after the trades)',
    'How are change orders priced — written and signed before work, with a stated hourly rate?',
    'What markup are you applying to materials, and can you see materials separated from labor?'
  ];

  var form = document.getElementById('quote-tool');
  if (!form) return;

  var verdict = document.getElementById('verdict');
  var stamp = document.getElementById('verdict-stamp');
  var body = document.getElementById('verdict-body');
  var rangeEl = document.getElementById('verdict-range');
  var questionsEl = document.getElementById('verdict-questions');

  function usd(n) {
    return n.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var serviceKey = document.getElementById('service').value;
    var amount = Number(document.getElementById('amount').value);
    var bids = Number(document.getElementById('bids').value);
    var permits = document.getElementById('permits').value;
    var itemized = document.getElementById('itemized').value;
    var service = SERVICES[serviceKey];

    if (!service || !amount || amount < 100) return;

    var kind, headline, message;

    if (amount < service.low) {
      kind = 'high';
      headline = 'Below the published range';
      message =
        usd(amount) +
        ' is under the ' +
        usd(service.low) +
        ' floor for ' +
        service.label.toLowerCase() +
        '. Low bids usually win by excluding scope, using thin allowances, or pricing extras as change orders later. Line up what is NOT included before comparing this number to anything else.';
    } else if (amount > service.high * 1.25) {
      kind = 'inflated';
      headline = 'Likely inflated — challenge this quote';
      message =
        usd(amount) +
        ' is more than 25% above the ' +
        usd(service.high) +
        ' top of the published band for ' +
        service.label.toLowerCase() +
        '. That can be justified by access, finish level, or urgency — but only if the quote shows it line by line. Do not sign yet: get a second written quote for the same scope and challenge the largest lines.';
    } else if (amount > service.high) {
      kind = 'high';
      headline = 'High for this job as described';
      message =
        usd(amount) +
        ' sits above the ' +
        usd(service.high) +
        ' top of the published band for ' +
        service.label.toLowerCase() +
        '. Ask what drives the difference — access, finish level, brand tier, or schedule — and require the answer in writing. If nothing on the page explains it, treat it as negotiable.';
    } else {
      kind = 'fair';
      headline = 'Inside the published range';
      message =
        usd(amount) +
        ' falls within the ' +
        usd(service.low) +
        '–' +
        usd(service.high) +
        ' national band for ' +
        service.label.toLowerCase() +
        '. The total passes the sanity check — now verify the scope, because a fair total with a front-loaded payment schedule or a vague allowance is not a fair deal.';
    }

    verdict.className = 'verdict show ' + kind;
    stamp.textContent = headline;
    body.textContent = message;
    rangeEl.textContent =
      'Published national range for ' +
      service.label +
      ': ' +
      usd(service.low) +
      '–' +
      usd(service.high) +
      ' · compiled from HomeGuide, Fixr, Angi and Forbes Home cost guides, as of October 2026.';

    var questions = [];

    if (bids === 1) {
      questions.push(
        'You have only one written quote. Get two more for the same written scope — the spread between three bids is how you learn what the job actually costs.'
      );
    } else if (bids === 2) {
      questions.push(
        'Add a third written quote for the same scope. Two numbers cannot tell you which one is the outlier.'
      );
    }

    if (permits !== 'yes') {
      questions.push(
        'Who pulls the permit, who pays the fee, and is the fee inside this total? A missing permit line on permitted work is a red flag — and unpermitted work can become your problem at resale.'
      );
    }

    if (itemized !== 'yes') {
      questions.push(
        'Ask for labor and materials broken out for every line over $2,000. You cannot challenge a number you cannot decompose.'
      );
    }

    questions = questions.concat(BASE_QUESTIONS);

    questionsEl.innerHTML = '';
    questions.forEach(function (q) {
      var li = document.createElement('li');
      li.textContent = q;
      questionsEl.appendChild(li);
    });

    verdict.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
