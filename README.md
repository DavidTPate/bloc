# Bloc
Functional Reactive array filtering and aggregation with a MongoDB inspired syntax.

<!-- toc -->

  - [Usage](#usage)
- [Query Selectors](#query-selectors)
  - [Comparison Operators](#comparison-operators)
    - [$eq](#eq)
    - [$ne](#ne)
    - [$gt](#gt)
    - [$gte](#gte)
    - [$lt](#lt)
    - [$lte](#lte)
    - [$in](#in)
    - [$nin](#nin)
    - [$mod](#mod)
    - [$regex](#regex)
    - [$where](#where)
  - [Logical Operators](#logical-operators)
    - [$or](#or)
    - [$and](#and)
    - [$not](#not)
    - [$nor](#nor)
  - [Array Operators](#array-operators)
    - [$all](#all)
    - [$elemMatch](#elemmatch)
    - [$size](#size)

<!-- tocstop -->

## Usage
For normal usage arrays are returned with the results.

```js
var Bloc = require('bloc');
var data = [
  {
    id: 1,
    region: 'us-east-1'
  },
  {
    id: 2,
    region: 'us-west-1'
  }
];
var filter = {
  region: {
    $eq: 'us-east-1'
  }
};

Bloc.filter(data, filter).then(function(results) {
  // Results contains all items in the `us-east-1` region.
}, function(reason) {
 // Something went wrong
});
```

If desired, a stream can be returned instead.

```js
var Bloc = require('bloc');
var data = [
  {
    id: 1,
    region: 'us-east-1'
  },
  {
    id: 2,
    region: 'us-west-1'
  }
];
var filter = {
  region: {
    $eq: 'us-east-1'
  }
};

Bloc.filter(data, filter, { stream: true }).then(function(stream) {
  stream.subscribe(function(item) {
    // Stream will eventually contain all items in the `us-east-1` region.
  });
}, function(reason) {
 // Something went wrong
});
```

# Query Selectors
Below is a list of all the supported query selectors.

## Comparison Operators
Used for the comparison of different values for filters.

### $eq
Matches all values that are equal to a specified value.

```js
{
  <field>: { 
    $eq: <value>
  }
}
```

### $ne
Matches all values that are not equal to a specified value.


```js
{
  <field>: { 
    $ne: <value>
  }
}
```

### $gt
Matches values that are greater than a specified value.

```js
{
  <field>: { 
    $gt: <value>
  }
}
```

### $gte
Matches values that are greater than or equal to a specified value.

```js
{
  <field>: { 
    $gte: <value>
  }
}
```

### $lt
Matches values that are less than a specified value.

```js
{
  <field>: { 
    $lt: <value>
  }
}
```

### $lte
Matches values that are less than or equal to a specified value.

```js
{
  <field>: { 
    $lte: <value>
  }
}
```

### $in
Matches any of the values specified in an array.

```js
{
  <field>: { 
    $in: [ <value1>, <value2>, ... <valueN> ]
  }
}
```

### $nin
Matches none of the values specified in an array.

```js
{
  <field>: { 
    $nin: [ <value1>, <value2>, ... <valueN> ]
  }
}
```

### $mod
Performs a modulo operation on the value of a field and selects documents with a specified result.

```js
{
  <field>: {
    $mod: [
      divisor,
      remainder
    ]
  }
}
```

### $regex
Selects documents where values match a specified regular expression.

```js
{
  <field>: {
    $regex: <regular expression>
  }
}
```

### $where
Matches documents that satisfy a JavaScript function.

```js
{
  <field>: {
    $where: <function>
  }
}
```

## Logical Operators
Used for grouping together filter clauses.

### $or
Joins query clauses with a logical **OR** returns all documents that match the conditions of either clause.

```js
{ 
  $or: [
    {
      <expression1>
    },
    {
      <expression2>
    },
    ...,
    {
      <expressionN>
    }
  ]
}
```

### $and
Joins query clauses with a logical **AND** returns all documents that match the conditions of both clauses.

```js
{ 
  $and: [
    {
      <expression1>
    },
    {
      <expression2>
    },
    ...,
    {
      <expressionN>
    }
  ]
}
```

### $not
Inverts the effect of a query expression and returns documents that do not match the query expression.

```js
{
  <field>: {
    $not: {
      <operator>: <value>
    }
  }
}
```

### $nor
Joins query clauses with a logical **NOR** returns all documents that fail to match both clauses.

```js
{ 
  $nor: [
    {
      <expression1>
    },
    {
      <expression2>
    },
    ...,
    {
      <expressionN>
    }
  ]
}
```

## Array Operators
Operators to use when filtering arrays.

### $all
Matches arrays that contain all elements specified in the query.

```js
{
  <field>: {
    $all: [
      <value1>,
      <value2>,
      ...,
      <valueN>
    ]
  }
}
```

### $elemMatch
Selects documents if element in the array field matches all the specified conditions.

```js
{
  <field>: {
    $elemMatch: {
      <query1>,
      <query2>,
      ...,
      <queryN>
    }
  }
}
```

### $size
Selects documents if the array field is a specified size.

```js
{
  <field>: {
    $size: <number>
  }
}
```