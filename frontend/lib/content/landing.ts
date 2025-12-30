/**
 * Landing page content constants
 * Centralized copy for easy editing and maintenance
 */

export const landingContent = {
  hero: {
    title: 'Where Trading Meets Impact',
    subtitle: 'CURE transforms every swap into measurable impact. Trading fees collected in ETH are split equally between pediatric cancer research at St. Jude and token supply reduction through buyback and burn. All economics are enforced onchain by smart contracts.',
  },
  
  credibility: {
    bullets: [
      'Onchain enforced economics',
      'ETH based fees with no sell pressure',
      'Permissionless processing',
    ],
  },
  
  stats: {
    donationSplit: {
      label: 'Donation Split',
      value: '50%',
      description: 'To St. Jude Children\'s Research Hospital',
    },
    buybackBurn: {
      label: 'Buyback & Burn',
      value: '50%',
      description: 'Reducing supply, benefiting holders',
    },
    feeRange: {
      label: 'Fee Range',
      value: '99% → 1%',
      description: 'Decays 1% per block over 98 blocks',
    },
    callerReward: {
      label: 'Caller Reward',
      value: '1%',
      description: 'Incentive for processing fees',
    },
  },
  
  howItWorks: {
    title: 'How It Works',
    steps: [
      {
        number: 1,
        title: 'Fee Collection',
        description: 'Every swap in the CURE/ETH pool generates a fee in ETH. The fee starts at 99% and decays by 1% per block until reaching 1%, where it remains.',
      },
      {
        number: 2,
        title: 'Permissionless Processing',
        description: 'Anyone can call processFees() to process accumulated ETH. The caller receives 1% as a reward. The remaining 99% is split equally: 49.5% is swapped to USDC and sent to St. Jude, 49.5% is swapped to CURE and permanently burned.',
      },
      {
        number: 3,
        title: 'Balanced Outcome',
        description: 'As trading volume increases, both donations to St. Jude and token supply reduction scale proportionally. Holder incentives and charitable impact grow together.',
      },
    ],
    formula: 'Fee (ETH) → 1% caller + 49.5% charity (USDC) + 49.5% buyback (CURE burn)',
  },
  
  impact: {
    title: 'Impact and Alignment',
    content: [
      'Fees are collected in ETH, not CURE tokens. This design ensures zero sell pressure on the token itself, protecting holder value while enabling direct charitable impact.',
      'The 50/50 split creates alignment: every dollar that benefits token holders through supply reduction is matched by a dollar sent to St. Jude. Impact and value scale together.',
    ],
  },
  
  builderDisclosureAndSupport: {
    title: 'Builder Disclosure and Support',
    supportSection: {
      title: 'Support the Builder',
      paragraphs: [
        'This project is fully bootstrapped and developed independently.',
        'If you find the work valuable and would like to support ongoing development, research, and maintenance, you may do so directly via voluntary onchain contributions.',
        'Contributions are optional and are not connected to token ownership, protocol usage, governance rights, or financial returns.',
      ],
      addresses: {
        ens: {
          label: 'Ethereum (ENS)',
          value: 'meltedfrozen.eth',
        },
        eth: {
          label: 'Ethereum (Address)',
          value: '0xE5E6ca8899E86E63Ef067e16825C04c52d20e595',
        },
        btc: {
          label: 'Bitcoin (BTC)',
          value: 'not yet published',
        },
      },
      contributionNote: 'Contributions are not investments and do not entitle contributors to any ownership, profit participation, or future benefit. They are purely voluntary donations to support continued development.',
    },
    disclosureSection: {
      title: 'Builder Disclosure',
      paragraphs: [
        'The CURE smart contracts are deployed and maintained by an independent builder. To avoid conflicts of interest and incentive misalignment, the builder does not receive protocol revenue and does not buy, hold, or trade the CURE token.',
        'The builder\'s role is limited to writing, deploying, and maintaining the open-source code and infrastructure required for the protocol to operate as designed. All onchain economics are enforced transparently by the contracts themselves, not by discretionary control.',
      ],
    },
  },
  
  footer: {
    text: 'CURE Token - Where every trade creates impact. Where every swap funds research.',
  },
} as const;
