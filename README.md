# Bloc
Array filtering and aggregation with a MongoDB inspired syntax.

## Usage
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
Bloc.query(data, query).then(function(results) {
  // Results contains all items in the `us-east-1` region.
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